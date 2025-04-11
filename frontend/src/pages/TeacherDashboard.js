import React from 'react';
import Sidebar from '../components/Sidebar';

const TeacherDashboard = () => {
    return (
        <div className="flex">
            <Sidebar role="teacher" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8">
                <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
                <div className="bg-white p-6 rounded shadow">
                    <p className="text-gray-700">Welcome, Teacher! You can create and manage exams.</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
