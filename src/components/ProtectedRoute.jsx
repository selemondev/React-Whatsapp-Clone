import React from 'react'
import { UserAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {
    const { user } = UserAuth();

    // if the user is not logged in or authenticated we will navigate him/her to the login page
    if(!user) {
        return <Navigate to="/"/>
    }
  return children;
}

export default ProtectedRoute;