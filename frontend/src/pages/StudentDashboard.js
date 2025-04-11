import React from 'react';
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
    return (
        <div className="flex">
            <Sidebar role="student" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8">
                <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
                <div className="bg-white p-6 rounded shadow">
                    <p className="text-gray-700">Welcome, Student! Here you can take or join exams.</p>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
