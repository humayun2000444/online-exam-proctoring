import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import config from "../../config";

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
            await axios.post(`${config.API_BASE_URL}/register`, formData);
            toast.success("Registration Successful! Please login.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    const inputClass = "w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-800 placeholder-gray-400";

    const renderRoleSpecificFields = () => {
        if (formData.role === 'student') {
            return (
                <>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
                        <input name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <input name="year" type="text" value={formData.year} onChange={handleChange} required className={inputClass} placeholder="Enter your year" />
                    </div>
                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
                        <input name="semester" type="text" value={formData.semester} onChange={handleChange} required className={inputClass} placeholder="Enter your semester" />
                    </div>
                    <div>
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                        <input name="section" type="text" value={formData.section} onChange={handleChange} required className={inputClass} placeholder="Enter your section" />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input name="student_id" type="text" value={formData.student_id} onChange={handleChange} required className={inputClass} placeholder="Enter your student ID" />
                    </div>
                </>
            );
        } else if (formData.role === 'teacher') {
            return (
                <>
                    <div>
                        <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">Teacher ID</label>
                        <input name="teacher_id" type="text" value={formData.teacher_id} onChange={handleChange} required className={inputClass} placeholder="Enter your teacher ID" />
                    </div>
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                        <input name="position" type="text" value={formData.position} onChange={handleChange} required className={inputClass} placeholder="Enter your position" />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                        <input name="designation" type="text" value={formData.designation} onChange={handleChange} required className={inputClass} placeholder="Enter your designation" />
                    </div>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-300 p-6">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl">
                <div className="flex justify-center mb-6">
                    <img src="/images/diit.png" alt="DIIT Logo" className="h-16 w-auto"/>
                </div>
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Use grid with 2 columns for input fields */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input name="name" type="text" value={formData.name} onChange={handleChange} required
                                   className={inputClass} placeholder="Your Name"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required
                                   className={inputClass} placeholder="example@diit.edu.bd or example@diit.info"/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700">Password</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange}
                                   required className={inputClass} placeholder="••••••••"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select
                                Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>

                        {/* Role specific fields */}
                        {renderRoleSpecificFields()}
                    </div>

                    {/* Buttons in full width below */}
                    <div className="pt-4 space-y-3">
                        <button type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200">
                            Register
                        </button>
                        <div className="text-center text-sm text-gray-600">Already have an account?</div>
                        <Link to="/login">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200">
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
