// src/utils/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserRole } from './auth';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = getToken();
    const role = getUserRole();

    if (!token || !allowedRoles.includes(role)) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
