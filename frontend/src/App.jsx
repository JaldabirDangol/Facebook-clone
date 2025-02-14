import Signup from './components/SignUp'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Friends from './components/Friends'
import Profile from './components/Profile'
import { Navbar } from './components/Navbar'
import UserProfile from './components/UserProfile'
import EditProfile from './components/EditProfile'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        path:'/friends',
        element:<Friends/>
      },{
        path:'/',
        element:<Home/>
      }
    ]
  },
  { path:'/profile/:id',
   element:<UserProfile/> 
   ,},
  { path:'/login',
    element:<Login/>
  } ,
  {  path:'/signup',
    element:<Signup/> },
])
function App() {
  return (
   <RouterProvider router={browserRouter} />
  )
}

export default App
