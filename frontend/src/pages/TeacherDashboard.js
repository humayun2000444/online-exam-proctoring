import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import config from '../config';
import { Users, BookOpen, CalendarCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/students`);
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
        fetchStudents();
    }, []);

    const totalExams = 5;
    const upcomingExams = 2;

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar role="teacher" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8 space-y-8">
                {/* Header */}
                <div className="bg-white shadow rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h1>
                        <p className="text-gray-500 mt-1">Here's your dashboard overview.</p>
                    </div>
                    <img src="/images/diit.png" alt="DIIT Logo" className="h-12 w-auto" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <StatCard icon={<Users className="text-green-500" size={28} />} label="Total Students" value={students.length} />
                    <StatCard icon={<BookOpen className="text-blue-500" size={28} />} label="Total Exams" value={totalExams} />
                    <StatCard icon={<CalendarCheck className="text-yellow-500" size={28} />} label="Upcoming Exams" value={upcomingExams} />
                </div>

                {/* Student Table */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Year</th>
                                <th className="px-4 py-3">Semester</th>
                                <th className="px-4 py-3">Class</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-green-50`}
                                        onClick={() => navigate(`/teacher-dashboard/student/${student.id}`)}
                                    >
                                        <td className="px-4 py-2">{student.id}</td>
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">{student.email}</td>
                                        <td className="px-4 py-2">{student.year}</td>
                                        <td className="px-4 py-2">{student.semester}</td>
                                        <td className="px-4 py-2">{student.class}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({icon, label, value}) => (
    <div className="bg-white p-6 rounded-2xl shadow text-center hover:shadow-lg transition duration-200">
        <div className="mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

export default TeacherDashboard;
