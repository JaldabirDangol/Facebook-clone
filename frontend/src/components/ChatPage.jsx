import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { MessageCircleCode, Search } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { FaThumbsUp } from 'react-icons/fa'; // Import icons
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { backendurl } from '../../configurl';
import { setSelectedUser } from '../../store/authSlice';
import { setMessages } from '../../store/chatSlice';
import useGetAllUsers from '@/hooks/useGetAllUsers';

const ChatPage = () => {
    useGetAllUsers();
    const [textMessage, setTextMessage] = useState("");
    const [inputSearch, setInputSearch] = useState("");
    const [inputTrigger, setInputTrigger] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { user, selectedUser, allUsers } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const delay = setTimeout(() => {
            if (inputSearch.trim()) {
                fetchSearchResults(inputSearch);
            } else {
                setSearchResults([]);
            }
        }, 300); 

        return () => clearTimeout(delay);
    }, [inputSearch]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${backendurl}/api/v1/user/search`,
                { searchRes: query },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            setSearchResults(res.data.searchResults);
            console.log()
        } catch (error) {
            toast.error("Error fetching users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${backendurl}/api/v1/message/${receiverId}/send`, { textMessage }, {
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
    const likeHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${backendurl}/api/v1/message/${receiverId}/send`, { textMessage: "👍" }, {
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

    const handleUserClick = (user) => {
        dispatch(setSelectedUser(user));
        setInputSearch(''); // Optionally clear search results when user is selected
    };

    return (
        <div className='flex bg-gray-150 w-full h-screen'>
  <aside className={selectedUser ? 'hidden md:block md:w-1/4  bg-white shadow-lg p-5 md:m-5 m-1  w-full  overflow-hidden border border-gray-300 rounded-2xl': ' md:w-1/4  bg-white shadow-lg p-5 md:m-5 m-1  w-full  overflow-hidden border border-gray-300 rounded-2xl md:block'}>
                <div className='sticky -top-5 z-10 bg-white -mx-1 border-b'>
                    <div className='flex gap-3 shadow-black items-center p-4 mb-4 -m-5 border-b bg-gray-200'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt='profile' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span className='font-medium'>{user?.username}</span>
                        </div>
                    </div>
                    <h1 className='font-bold text-xl mb-4'>Chats</h1>
                    <div className="relative  w-full mb-6 mx-auto">
                        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input type="text"
                            placeholder="Search users..."
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            onFocus={() => setInputTrigger(true)}
                            onBlur={() => setInputTrigger(false)}
                            className="rounded-3xl pl-10 "
                        />
                    </div>
                </div>
                <div className='overflow-y-auto w-[100%] h-[calc(640px-150px)] scrollbar-thin pr-2'>
                    {!inputTrigger ? (
                        <div className='mt-1'>
                            {allUsers && allUsers.map((allUser) => {
                                const isOnline = onlineUsers.includes(allUser?._id);
                                const isSelected = selectedUser?._id === allUser?._id;
                                return (
                                    <div key={allUser?._id} onClick={() => { dispatch(setSelectedUser(allUser)) }} className={`flex gap-3 items-center py-2 px-3 mb-1 hover:bg-gray-100 cursor-pointer rounded-full ${isSelected ? 'bg-gray-200 hover:bg-gray-200' : ''}`}>
                                        <Avatar className='w-12 h-12'>
                                            <AvatarImage src={allUser?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col '>
                                            <span className='font-medium'>{allUser?.username}</span>
                                            <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>) : (<div>
                            {inputSearch.trim() && (
                                <div className='mt-2'>
                                    {loading ? (
                                        <p className="text-gray-500 p-2">Loading...</p>
                                    ) : (
                                        searchResults.length > 0 ? (
                                            searchResults.map((user) => (
                                                <div
                                                    key={user._id}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-2xl cursor-pointer"
                                                    onMouseDown={() => handleUserClick(user)}
                                                >
                                                    <Avatar>
                                                        <AvatarImage src={user.profilePicture} />
                                                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{user.username}</span>
                                                </div>
                                            ))
                                        ) : (<p className="text-gray-500 p-2">No users found</p>)
                                    )}
                                </div>
                            )}
                        </div>
                    )
                    }</div>
            </aside>

            <main className={ selectedUser ? 'flex-1 relative flex flex-col  bg-white shadow-lg rounded-2xl border border-gray-300 m-5  overflow-hidden w-full ':'hidden  relative md:flex   bg-white shadow-lg rounded-2xl border border-gray-300 m-5  overflow-hidden w-full '}>
                {selectedUser ? (
                    <section className='flex flex-col  w-full'>
                        <div className='flex gap-3  items-center p-4 border-b border-gray-300 bg-gray-200'>

                            {/* arrow */}
                            <button onClick={()=>dispatch(setSelectedUser(null))}>back</button>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-medium'>{selectedUser?.username}</span>
                            </div>
                        </div>
                   <div className='mb-4 overflow-y-auto max-h-[80vh]'>
                   <Messages selectedUser={selectedUser} />
                   </div>
                        <div className='flex items-center  p-4 border-t bg-white  absolute bottom-2 w-full justify-between right-1'>
                            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent rounded-full ' placeholder="Type a message..." />
                            {textMessage ?
                                <PiPaperPlaneRightFill className='cursor-pointer text-blue-500 w-7 h-7 ' onClick={() => sendMessageHandler(selectedUser?._id)}/>
                                : <FaThumbsUp className='cursor-pointer text-blue-500 w-6 h-6 ml-1' onClick={() => likeHandler(selectedUser?._id)}/>}
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center flex-1 p-10 '>
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