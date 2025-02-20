import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendurl } from "../../configurl";
import { setMessages } from "../../store/chatSlice";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);
    useEffect(() => {
        if (!selectedUser?._id) return
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`${backendurl}/api/v1/message/${selectedUser?._id}/allmessage`, { withCredentials: true });
                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser._id,dispatch]);
};
export default useGetAllMessage;