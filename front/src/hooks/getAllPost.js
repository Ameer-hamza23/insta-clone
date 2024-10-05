import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPost } from "../redux/PostSlice";
import { POST } from "../Api.js";

const useGetAllPosts = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get(`${POST}/getAllPosts`, { withCredentials: true });
                
                if (res.data.status) {
                    dispatch(setPost(res.data.posts));
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        getPosts();
    }, [dispatch]);
};

export default useGetAllPosts;
