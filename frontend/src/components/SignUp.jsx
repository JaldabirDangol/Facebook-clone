import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { backendurl } from "../../configurl";
import { toast } from "sonner";


const SignUp = () => {
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const [inputInfo, setInputInfo] = useState({
    username: "",
    password: "",
    email: "",
    gender: "",
  });

  
  const changeEventHandler = (e) => {
    setInputInfo({ ...inputInfo, [e.target.name]: e.target.value });
  };
  const signUpHandler = async(e) => {
    e.preventDefault();
    setLoading(true)
      try {
        const res =  await axios.post(`${backendurl}/api/v1/user/signup`,inputInfo,{
          headers:{
           'Content-Type':'application/json'
          },
          withCredentials:true
       });
      if(res.data.success){
        toast.success(res.data.message)
        setInputInfo({
          username:'',
          password:'',
          email:'',
          gender:''
        })
          navigate("/login");
      }
      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
      }finally{
      setLoading(false)

      }
  };
 

  return (
    <div className="w-screen h-screen flex flex-col flex-cols items-center justify-start ">
      <div className=" text-5xl text-blue-600 font-semibold mt-8">Facebook</div>
      <div className="border-zinc-100 border p-4 rounded-xl shadow-md  mt-12 w-full md:w-[47%] lg:w-[32%] ">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold">Create a new account</h1>
          <span className="text-slate-500">it's quick and easy</span>
        </div>
        <hr className="border-b-1 bg-slate-300 mt-2" />

        <form className="mt-2" onSubmit={signUpHandler}>
          <div>
            <Label className="text-slate-500" htmlFor="username">
              Username
            </Label>
            <Input
              className="mt-2"
              value={inputInfo.username}
              name="username"
              onChange={changeEventHandler}
              placeholder="Username"
            />
          </div>

          <div>
            <Label htmlFor='gender' className="flex text-slate-500 mt-2"> Gender </Label>
            <div className="flex items-center pt-1">
              <Input
                type="radio"
                className="form-radio h-4 w-4 ml-2"
                checked={inputInfo.gender === 'male'}
                onChange={changeEventHandler}
                value ='male'
                name='gender'
              />
              <span className="ml-2">male</span>
              <Input
                type="radio"
                name="gender"
                value="female"
                checked={inputInfo.gender === "female"}
                onChange={changeEventHandler}
                className="ml-2 form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Female</span>
            </div>
          </div>

          <div>
            <Label className="text-slate-500" htmlFor="Email">
              Email
            </Label>
            <Input
              className="mt-2"
              value={inputInfo.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Email"
            />
          </div>
          <div>
            <Label className="text-slate-500" htmlFor="username">
              Password
            </Label>
            <Input
              className="mt-2"
              type="password"
              value={inputInfo.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
            />
          </div>

          <div className=" p-2 rounded-lg text-[12px] font-medium text-slate-500 mt-2">
            <p>
              People who use our service may have uploaded your contact  information to
            </p>
            <p >Facebook. Learn more.</p>
            <p>
              By clicking Sign Up, you agree to our Terms, Privacy Policy and
              Cookies Policy.
            </p>
            <p>
              You may receive SMS Notifications from us and can opt out any time
            </p>
          </div>

         <div className="flex flex-col items-center mt-4">
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
                Sign Up
              </Button>
            )
          }
          <div className="text-blue-500 font-semibold mt-4">
           <Link to='/login'> Already have an account</Link>
          </div>
         </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
