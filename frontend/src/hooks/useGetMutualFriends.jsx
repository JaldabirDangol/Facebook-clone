import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendurl } from "../../configurl";
import { setMutualFriends } from "../../store/authSlice";

const useGetMutualFriends = () => {
    const dispatch = useDispatch();
    const { userProfile } = useSelector(store=>store.auth);
    useEffect(() => {
        const fetchMutualFriends = async () => {
            try {
                const res = await axios.get(`${backendurl}/api/v1/user/mutualfriend/${userProfile._id}`, {
                  withCredentials: true
                })
                if (res.data.success) {
                  dispatch(setMutualFriends(res.data.mutual))

                }
              } catch (error) {
                console.log(error)
              }
        }
        fetchMutualFriends();
    }, []);
};
export default useGetMutualFriends;