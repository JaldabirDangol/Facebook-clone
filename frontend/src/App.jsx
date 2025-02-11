import Signup from './components/SignUp'
import Login from './components/Login'
import Home from './components/Home'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  } ,
  {
    path:'/signup',
    element:<Signup/>
  }
])
function App() {
  return (
   <RouterProvider router={browserRouter} />
  )
}

export default App
