// src/utils/auth.js

export const saveToken = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role); // Save the role too
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUserRole = () => {
    return localStorage.getItem('role'); // <-- This was missing
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};
