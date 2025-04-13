import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        birthdate: '',
        year: '',
        semester: '',
        section: '',
        student_id: '',
        teacher_id: '',
        position: '',
        designation: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[a-zA-Z0-9._%+-]+@diit\.(edu\.bd|info)$/;

        if (!emailPattern.test(formData.email)) {
            toast.error("Email must be example@diit.edu.bd or example@diit.info");
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', formData);
            toast.success("Registration Successful! Please login.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };


    const renderRoleSpecificFields = () => {
        if (formData.role === 'student') {
            return (
                <>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
                        <input
                            name="birthdate"
                            type="date"
                            value={formData.birthdate}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                            name="year"
                            type="text"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your year"
                        />
                    </div>
                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
                        <input
                            name="semester"
                            type="text"
                            value={formData.semester}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your semester"
                        />
                    </div>
                    <div>
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                        <input
                            name="section"
                            type="text"
                            value={formData.section}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your section"
                        />
                    </div>
                    <div>
                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input
                            name="student_id"
                            type="text"
                            value={formData.student_id}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your student ID"
                        />
                    </div>
                </>
            );
        } else if (formData.role === 'teacher') {
            return (
                <>
                    <div>
                        <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">Teacher ID</label>
                        <input
                            name="teacher_id"
                            type="text"
                            value={formData.teacher_id}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your teacher ID"
                        />
                    </div>
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                            name="position"
                            type="text"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your position"
                        />
                    </div>
                    <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                        <input
                            name="designation"
                            type="text"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your designation"
                        />
                    </div>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 p-6">
            <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="example@diit.edu.bd or example@diit.info"
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
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    {renderRoleSpecificFields()}
                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                        >
                            Register
                        </button>
                        <span>Already have an account?</span>
                        <Link to="/login">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
                                Login
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
