import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../store/authSlice';
import { backendurl } from '../../configurl'; 

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${backendurl}/api/v1/user/profile/${userId}`, {
          withCredentials: true
        });


        if (res.data.success) {
          dispatch(setUserProfile(res.data.user)); 
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchUserProfile();  
    }
  }, [userId, dispatch]); 
};

export default useGetUserProfile;
