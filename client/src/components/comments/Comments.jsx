import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from 'react-query';
import { makeRequest } from "../../axios";
import moment from "moment";
import {
    useMutation,
    useQueryClient
} from 'react-query';

const Comments = ({ postId }) => {

    const [desc, setDesc] = useState("");

    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(["comments"], () =>
        makeRequest.get("/comments?postId=" + postId).then((res) => {
            return res.data;
        })
    )


    const queryClient = useQueryClient()
    // Mutations
    const mutation = useMutation((newComment) => {
        return makeRequest.post("/comments", newComment);
    }, {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["comments"]);
        },
    })



    const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({ desc, postId });
        setDesc("");
    }

    return (
        <div className="comments">
            <div className="write">
                <img src={"/upload/" + currentUser.profilePic}
                    alt=""
                    onError={(e) => {
                        e.target.src = "/upload/default.jpg";
                    }}
                />
                <input type="text"
                    placeholder="write a comment"
                    value={desc}
                    onChange={e => setDesc(e.target.value)} />
                <button onClick={handleClick}>Send</button>
            </div>
            {isLoading ? "Loading" :
                (data.map((comment) => (
                    <div className="comment">
                        <img src={"/upload/" + comment.profilePic}
                            alt=""
                            onError={(e) => {
                                e.target.src = "/upload/default.jpg";
                            }}
                        />
                        <div className="info">
                            <span>{comment.name}</span>
                            <p>{comment.desc}</p>
                        </div>
                        <span className="date">{moment(comment.createdAt).fromNow()}</span>
                    </div>
                )))}
        </div>
    );
};

export default Comments;