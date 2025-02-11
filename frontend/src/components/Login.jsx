import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { backendurl } from "../../configurl";
import { toast } from "sonner";


const Login = () => {
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const [inputInfo, setInputInfo] = useState({
    password: "",
    email: "",
  });
  
  const changeEventHandler = (e) => {
    setInputInfo({ ...inputInfo, [e.target.name]: e.target.value });
  };
  const logInHandler = async(e) => {
    e.preventDefault();
    setLoading(true)
      try {
        const res =  await axios.post(`${backendurl}/api/v1/user/login`,inputInfo,{
          headers:{
           'Content-Type':'application/json'
          },
          withCredentials:true
       });
      if(res.data.success){
        toast.success(res.data.message)
        setInputInfo({
          password:'',
          email:'',
        })
          navigate("/");
      }
      } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error)
      }finally{
      setLoading(false)

      }
  };
 
  return (
    <div className="w-screen h-screen flex flex-col flex-cols items-center justify-start ">
      <div className=" text-6xl text-blue-600 font-semibold mt-8">Facebook</div>
      <div className="text-3xl font-bold mt-8">Connect with friends and the world </div>
      <div className="text-3xl font-bold">around you on Facebook.</div>
      <div className="border-zinc-100 border p-4 rounded-xl shadow-md  mt-12 w-full md:w-[47%] lg:w-[32%] ">

        <form className="mt-4" onSubmit={logInHandler}>
          <div>
            <Label className="text-slate-500" htmlFor="Email">
              Email
            </Label>
            <Input
              className="mt-4"
              value={inputInfo.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Email"
            />
          </div>
          <div className="mt-4">
            <Label className="text-slate-500" htmlFor="username">
              Password
            </Label>
            <Input
              className="mt-4"
              type="password"
              value={inputInfo.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
            />
          </div>

         <div className="flex flex-col items-center mt-8">
         {
            loading ? (
              <Button className=" relative w-1/2 py-2 rounded-md text-lg font-semibold bg-green-600 hover:bg-green-700">
                <div className="flex items-center justify-center space-x-2 w-1/2">
                  <Loader2 className="text-white w-5 h-5 animate-spin" />
                  <span className="text-white">Please wait</span>
                </div>
              </Button>
            ) : (
              <Button type="submit" className=" w-1/2 py-2 rounded-md text-lg font-semibold bg-green-600 hover:bg-green-700">
               Login
              </Button>
            )
          }
          <div className="text-blue-500 mt-4 font-semibold ">
            Forgot Password?
          </div>
          <div className="text-blue-500 font-semibold mt-4">
           <Link to='/signup'> Dont  have an account</Link>
          </div>
         </div>
        </form>
      </div>
      <div className="mt-6">
        Create a Page for a celebrity, brand or business.
        </div>
    </div>
  );
};

export default Login;
