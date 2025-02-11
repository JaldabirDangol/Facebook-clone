import Signup from './components/SignUp'
import Login from './components/Login'
import './App.css'
import { createBrowserRouter } from 'react-router-dom'

const browserRouter = createBrowserRouter([
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
    <div>
     <Signup/>
    </div>
  )
}

export default App
