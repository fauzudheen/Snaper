import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
  };
  
export const PublicOnlyRoute = () => {
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};