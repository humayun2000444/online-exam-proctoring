import React, { useState } from 'react';
import axios from 'axios';
import { saveToken } from '../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', formData);
            const { token, role } = res.data;
            saveToken(token, role);
            toast.success('Login Successful!', {
                style: {
                    background: 'green',
                    color: 'white',
                },
            });

            if (role === 'student') {
                navigate("/student-dashboard");
            } else if (role === 'teacher' || role === 'admin') {
                navigate("/teacher-dashboard");
            } else {
                alert("Invalid role. Contact administrator.");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const inputClass = "w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-800 placeholder-gray-400";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-300 p-6">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
                        >
                            Login
                        </button>
                        <div className="text-center text-sm text-gray-600">Don't have an account?</div>
                        <Link to="/register">
                            <button
                                type="button"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
                            >
                                Register
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
