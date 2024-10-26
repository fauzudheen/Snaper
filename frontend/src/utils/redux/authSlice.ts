import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, SignInResponse } from '../../types/types';


const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserSignIn(state: AuthState, action: PayloadAction<SignInResponse>) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.user = action.payload.user;
    },
    setUserSignOut(state: AuthState) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setAccessToken(state: AuthState, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAccessToken(state: AuthState) {
      state.accessToken = null;
    },
  },
});

export const { setUserSignIn, setUserSignOut, setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;