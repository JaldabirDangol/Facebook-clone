import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import Signup from './components/SignUp'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import Friends from './components/Friends'
import UserProfile from './components/UserProfile'
import { setOnlineUsers } from '../store/chatSlice'
import {  setNotification } from '../store/rtnSlice'
import './App.css'
import { backendurl } from '../configurl'
import { setSocket } from '../store/socketSlice'
import SuggestedUserList from './components/SuggestedUserList'
import Saved from './components/Saved'
import ChatPage from './components/ChatPage'
import ProtectedRoutes from './components/ProtectedRoutes';
const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/suggesteduser', element:<ProtectedRoutes><SuggestedUserList/></ProtectedRoutes> },
      { path: 'friends' , element: <ProtectedRoutes><Friends/></ProtectedRoutes> },
      { path: '/', element: <ProtectedRoutes> <Home /></ProtectedRoutes>  },
      { path: '/savedpost', element: <ProtectedRoutes><Saved/></ProtectedRoutes> }
    ]
  },
  { path : '/chat' ,element: <ProtectedRoutes><ChatPage/></ProtectedRoutes> },
  { path: '/profile/:id', element:  <ProtectedRoutes><UserProfile /></ProtectedRoutes>  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> }
])

function App() {
  const { user } = useSelector(store => store.auth)
  const {socket} = useSelector(store => store.socketio)
  const dispatch = useDispatch()
  const [fetched,setFetched] = useState(false)
  useEffect(() => {
    if (user && !fetched) {
      const socketio = io(`${backendurl}`, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));
        setFetched(false)
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (reaction) => {
        dispatch(setNotification(reaction));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user,dispatch]);
  return (
    <div>
      <RouterProvider router = {browserRouter}/>
    </div>
  )
}



export default App;
