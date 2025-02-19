import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { backendurl } from "../../configurl";
import { setAllUser } from "../../store/authSlice";

const useGetAllUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get(`${backendurl}/api/v1/user/getallusers`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setAllUser(res.data.allUsers));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllUsers();
    }, []);
};
export default useGetAllUsers;