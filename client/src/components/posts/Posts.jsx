import { useState } from "react";
import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import {
    useQuery,
    useMutation,
    useQueryClient
} from 'react-query';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const Posts = ({ userId }) => {

    const [postFilter, setOpenFilter] = useState(false);
    const [friendOnly, setFriendOnly] = useState(false);

    const { isLoading, error, data } = useQuery(["posts", friendOnly], () =>
        makeRequest.get("/posts?userId=" + userId + "&friendOnly=" + friendOnly).then((res) => {
            return res.data;
        })
    )
    return (
        <div className="posts">
            {userId === undefined && <div className="filter">
                <button onClick={() => setOpenFilter(!postFilter)}>
                    Filter {postFilter ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </button>
                {postFilter && <div className="list">
                    <button disabled={friendOnly === false} onClick={() => setFriendOnly(!friendOnly)}>All</button>
                    <button disabled={friendOnly === true} onClick={() => setFriendOnly(!friendOnly)} >Only Following</button>
                </div>}

            </div>}

            {error
                ? "Something went wrong!"
                : isLoading
                    ? "loading"
                    : data.map((post) => <Post post={post} key={post.id} />)}
        </div>
    );
};

export default Posts;