import axios from "axios";
import { USER } from "../Api";
import { useDispatch } from "react-redux";
import { setSelectedProfileUser } from "../redux/AuthSlice";
import { useEffect } from "react";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${USER}/getProfile/${userId}`, { withCredentials: true });
                
                if (res.data.status) {
                    dispatch(setSelectedProfileUser(res.data.user));
                } else {
                    console.log("Failed to fetch user profile.");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, dispatch]);
};

export default useGetUserProfile;
