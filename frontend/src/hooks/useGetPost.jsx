import axios from 'axios'
import React, { useEffect } from 'react'
import { backendurl } from '../../configurl'
import { useDispatch } from 'react-redux'
import { setAllpost } from '../../store/postSlice'

const useGetPost = () => {
    const dispatch = useDispatch();
  try {
    useEffect(()=>{
        const fetchAllPost = async()=>{
            const res = await axios.get(`${backendurl}/api/v1/post/getallpost`,{
                withCredentials:true
            })
            if(res.data.success){
                dispatch(setAllpost(res.data.post))
            }
        }
        fetchAllPost()
    },[])
  } catch (error) {
    console.log(error)
  }
}

export default useGetPost