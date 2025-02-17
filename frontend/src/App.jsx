import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/friends', element: <Friends /> },
      { path: '/', element: <Home /> }
    ]
  },
  { path: '/profile/:id', element: <UserProfile /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> }
])

function App() {
  const { user } = useSelector(store => store.auth)
  const {socket} = useSelector(store => store.socketio)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      const socketio = io(`${backendurl}`, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
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
  }, [user, dispatch]);
  return (
    <div>
      <RouterProvider router = {browserRouter}/>
    </div>
  )
}

export default App
