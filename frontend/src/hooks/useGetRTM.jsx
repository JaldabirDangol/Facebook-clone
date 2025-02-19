import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, setMessages } from "../../store/chatSlice";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { messages } = useSelector(store => store.chat);
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        })
        socket?.on('deletemessage', (deletemessage) => {
            dispatch(deleteMessage(deletemessage._id));
        })
        return () => {
            socket?.off('newMessage');
        }
    }, [messages, setMessages]);
};
export default useGetRTM;