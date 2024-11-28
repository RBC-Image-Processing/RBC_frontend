import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../api/token'; // Adjust the path to where you have defined getToken

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const { user } = useAuth(); //Context Api wont persist user information across page refreshes

  const token = getToken('token');

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
