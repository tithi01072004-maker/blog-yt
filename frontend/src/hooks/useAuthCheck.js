import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import axios from 'axios';
import { useEffect } from 'react';

export const useAuthCheck = () => {
    const dispatch = useDispatch();

    const checkAuth = async () => {
        try {
            const { data } = await axios.get(
                'https://blog-yt-2-6xw0.onrender.com/api/v1/user/me', 
                { withCredentials: true }
            );
            dispatch(setUser(data.user)); // ✅ use dispatch
        } catch (error) {
            console.log("Not logged in");
        }
    };

    return { checkAuth };
};
