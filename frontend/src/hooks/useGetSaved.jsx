import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { backendurl } from '../../configurl'
import { setUserSavedPost } from '../../store/authSlice'

const useGetSaved = () => {
    const dispatch = useDispatch()
    const {user} = useSelector(store=>store.auth)
    const [fetched,setFetched] = useState(false)

    useEffect(()=>{
        if (!user) return; 
        const fetchSaved = async ()=>{

        try {
            const res = await axios.get(`${backendurl}/api/v1/post/userpost`,
                {withCredentials:true}
            )
            if(res.data.success){
             dispatch(setUserSavedPost(res.data.userPost));
             setFetched(true)
            }
        } catch (error) {
            console.log(error)
        }}
        
        if(user && !fetched){
            fetchSaved()
        }
    },[user])

  return (
   null
  )
}

export default useGetSaved