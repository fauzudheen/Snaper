import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { Outlet, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../api/urls'
import axios from 'axios'
import { setUserSignIn, setUserSignOut } from '../redux/authSlice'

const UserProtectedRoutes = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const refreshToken = useSelector((state: RootState) => state.auth.refreshToken)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const updateToken = useCallback(async () => {
        console.log("updateToken triggered");
    
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
          if (response.status === 200) {
            console.log('Token refreshed successfully:', response.data);
            dispatch(setUserSignIn(response.data));
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          dispatch(setUserSignOut());
          navigate('/signin');
        }
      }, [refreshToken, dispatch, navigate]);
    
      const verifyToken = async () => {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/verify/`, { token: refreshToken });
          if (response.status === 200) {
            console.log('Token verified successfully:', response.data);
            return
          } else {
            console.error('Failed to verify token:', response.data);
            updateToken();
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
        }
      };
    
      useEffect(() => {
        if (isAuthenticated) {
          verifyToken();
        } else {
          navigate('/signin');
        }
      }, [isAuthenticated, navigate]);

    useEffect(() => {
        let interval: number | null = null;
        if (isAuthenticated) {
          interval = setInterval(updateToken, 50 * 1000); // 110 minutes
        }
    
        return () => {
          if (interval) {
            clearInterval(interval);
          }
        };
      }, [isAuthenticated, updateToken]);

  return isAuthenticated ? <Outlet /> : null
}

export default UserProtectedRoutes
