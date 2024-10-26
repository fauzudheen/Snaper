import React, { useEffect } from 'react'
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setUserSignIn, setUserSignOut } from '../redux/authSlice';
import axios from 'axios';
import { API_BASE_URL } from '../api/urls';

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const refreshToken = useSelector((state: RootState) => state.auth.refreshToken)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (!isAuthenticated || !refreshToken) return;

        const refreshTokenNow = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { 
            refresh: refreshToken 
            });
            console.log('Token refreshed successfully:', response.data);
            dispatch(setUserSignIn(response.data));
        } catch (error) {
            console.error('Failed to refresh token:', error);
            dispatch(setUserSignOut()); 
        }
        }; 
        refreshTokenNow();

        const refreshInterval = setInterval(refreshTokenNow, 5 * 60 * 1000); 

        return () => clearInterval(refreshInterval);
    }, [dispatch]);

    return <>{children}</>;
    };

export default AuthProvider

