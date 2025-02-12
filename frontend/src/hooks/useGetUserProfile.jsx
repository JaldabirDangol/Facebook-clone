import axios from 'axios'
import React, { useEffect } from 'react'
import { backendurl } from '../../configurl'
import { useDispatch } from 'react-redux'
import { setUserProfile } from '../../store/authSlice'

export const useGetUserProfile = async(userId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
       const fetchUserProfile = async()=>{
        try {
            const res = await axios.get(`${backendurl}/api/v1/user/profile/${userId}`,{
                withCredentials:true
            })
            if(res.data.success){
                 dispatch(setUserProfile(res.data.user))
            }
         } catch (error) {
            console.log(error)
         }
       }
       fetchUserProfile()
    },[userId])
}
