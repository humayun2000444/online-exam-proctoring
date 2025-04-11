import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Sidebar from "./Sidebar";

const CreateExam = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', duration: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/create_exam', formData, {
                headers: { Authorization: getToken() }
            });
            alert("Exam Created!");
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Try again"));
        }
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6 bg-gray-50 min-h-screen">
            <Sidebar role="teacher" />
            <h3 className="text-3xl font-semibold text-gray-800">Create Exam</h3>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md space-y-4"
            >
                <div>
                    <input
                        name="title"
                        type="text"
                        placeholder="Exam Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <textarea
                        name="description"
                        placeholder="Exam Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        name="duration"
                        type="number"
                        placeholder="Duration in minutes"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        Create Exam
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExam;
