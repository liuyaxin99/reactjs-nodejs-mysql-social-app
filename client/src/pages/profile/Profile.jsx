import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import { makeRequest } from "../../axios";
import {
    useQuery,
    useMutation,
    useQueryClient
} from 'react-query';
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
    const [openUpdate, setOpenUpdate] = useState(false)
    const { currentUser } = useContext(AuthContext)
    const userId = parseInt(useLocation().pathname.split("/")[2]);

    const { isLoading, error, data } = useQuery(["user"], () =>
        makeRequest.get("/users/find/" + userId).then((res) => {
            return res.data;
        })
    )

    const { isLoading: rIsLoading, data: relationshipData } = useQuery(["relationship"], () =>
        makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
            return res.data;
        })
    )
    const queryClient = useQueryClient()

    const mutation = useMutation((following) => {
        if (following) return makeRequest.delete("/relationships?userId=" + userId);
        return makeRequest.post("/relationships", { userId })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["relationship"]);
        },
    })


    const handleFollow = () => {
        mutation.mutate(relationshipData.includes(currentUser.id))
    }

    return (
        <div className="profile">
            {isLoading ? "loading" : <>
                <div className="images">
                    <img
                        src={"/upload/" + data.coverPic}
                        alt=""
                        className="cover"
                        onError={(e) => {
                            e.target.src = "/upload/defaultCover.png";
                        }}
                    />

                    <img
                        src={"/upload/" + data.profilePic}
                        className="profilePic"
                        onError={(e) => {
                            e.target.src = "/upload/default.jpg";
                        }}
                    />
                </div>
                <div className="profileContainer">
                    <div className="uInfo">
                        <div className="left">
                            {/* <a href="http://facebook.com">
                                <FacebookTwoToneIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <InstagramIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <TwitterIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <LinkedInIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <PinterestIcon fontSize="medium" />
                            </a> */}
                        </div>
                        <div className="center">
                            <span>{data.name}</span>
                            <div className="info">
                                <div className="item">
                                    <PlaceIcon />
                                    {data.city !== null ? <span>{data.city}</span> : <span>Location</span>}
                                </div>
                                <div className="item">
                                    <LanguageIcon />
                                    {data.website !== null ? <span>{data.website}</span> : <span>Website</span>}
                                </div>
                            </div>
                            {rIsLoading ? "Loading" : userId === currentUser.id ? <button onClick={() => setOpenUpdate(true)}>update</button> :
                                <button onClick={handleFollow}> {relationshipData.includes(currentUser.id) ? "Following" : "Follow"}</button>}
                        </div>
                        <div className="right">
                            {/* <EmailOutlinedIcon />
                            <MoreVertIcon /> */}
                        </div>
                    </div>
                    <Posts userId={userId} />
                </div>
            </>
            }
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
        </div>
    );
};

export default Profile;