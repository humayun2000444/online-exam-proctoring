import React from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, ClipboardList, LineChart } from 'lucide-react';

const StudentDashboard = () => {
    const upcomingExams = [
        { subject: "Math", date: "2025-05-20", time: "10:00 AM" },
        { subject: "Physics", date: "2025-05-22", time: "1:00 PM" },
        { subject: "English", date: "2025-05-25", time: "9:00 AM" },
    ];

    const performance = {
        completedExams: 8,
        averageScore: 82,
        highestScore: 95,
    };

    return (
        <div className="flex">
            <Sidebar role="student" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8 space-y-8">
                {/* Welcome, Header */}
                <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Student 👋</h1>
                        <p className="text-gray-500 mt-2">You have {upcomingExams.length} upcoming exams. Good luck!</p>
                    </div>
                    <img src="/images/diit.png" alt="Logo" className="h-12 w-auto" />
                </div>

                {/* Upcoming Exams */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-green-500" /> Upcoming Exams
                    </h2>
                    <ul className="space-y-3">
                        {upcomingExams.map((exam, index) => (
                            <li key={index} className="flex justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow">
                                <span className="font-medium">{exam.subject}</span>
                                <span className="text-gray-500">{exam.date} at {exam.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Performance Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow text-center">
                        <ClipboardList className="mx-auto text-blue-500 mb-2" size={28} />
                        <h3 className="text-lg font-semibold">Completed Exams</h3>
                        <p className="text-2xl font-bold text-gray-800">{performance.completedExams}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow text-center">
                        <LineChart className="mx-auto text-yellow-500 mb-2" size={28} />
                        <h3 className="text-lg font-semibold">Average Score</h3>
                        <p className="text-2xl font-bold text-gray-800">{performance.averageScore}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow text-center">
                        <LineChart className="mx-auto text-green-500 mb-2" size={28} />
                        <h3 className="text-lg font-semibold">Highest Score</h3>
                        <p className="text-2xl font-bold text-gray-800">{performance.highestScore}%</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow font-medium">
                            Join Live Exam
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow font-medium">
                            View Exam Results
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl shadow font-medium">
                            Exam Guidelines
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
