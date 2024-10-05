import axios from "axios";
import { useEffect } from "react";
import { USER } from "../Api";
import { useDispatch } from "react-redux";
import { getSuggestedUser1 } from "../redux/AuthSlice";

// Custom hook to fetch suggested users
const useSuggestedUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER}/otheruser`, { withCredentials: true });
        if (res.data.status) {
          dispatch(getSuggestedUser1(res.data.users));
        }
      } catch (error) {
        console.log("Error fetching suggested users:", error);
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default useSuggestedUser;
