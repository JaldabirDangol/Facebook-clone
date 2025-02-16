import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '../redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '../redux/chatSlice';
import { BACKEND_URL } from '../../configURL';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'; // Import icons

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();


    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const likeHandler =async (receiverId)=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/message/send/${receiverId}`, { textMessage:"👍" }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className='flex h-screen bg-gray-100'>
            <aside className='w-1/4 bg-white shadow-lg p-5 h-[660px] overflow-y-auto'>
                <h1 className='font-bold text-xl mb-4'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div key={suggestedUser?._id} onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-200 cursor-pointer rounded-lg'>
                                <Avatar className='w-12 h-12'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
            <main className='flex-1 flex flex-col h-[660px] bg-white shadow-lg rounded-lg overflow-hidden'>
                {selectedUser ? (
                    <section className='flex flex-col h-full'>
                        <div className='flex gap-3 items-center p-4 border-b border-gray-300 bg-gray-100'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-medium'>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t'>
                            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Type a message..." />
                            {textMessage ?
                                <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                                : <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => likeHandler(selectedUser?._id)}><FaThumbsUp/></Button>}
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center flex-1 p-10'>
                        <MessageCircleCode className='w-24 h-24 text-gray-400' />
                        <h1 className='font-medium text-lg mt-4'>Your messages</h1>
                        <span className='text-gray-500'>Select a user to start chatting.</span>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ChatPage;