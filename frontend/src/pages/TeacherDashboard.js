import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import config from '../config';
const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Fetch student data from the backend API
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

    return (
        <div className="flex">
            <Sidebar role="teacher" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8">
                <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
                <div className="bg-white p-6 rounded shadow mb-8">
                    <p className="text-gray-700">Welcome, Teacher! You can create and manage exams.</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student List</h2>
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Name</th>
                            <th className="px-4 py-2 border-b text-left">Email</th>
                            <th className="px-4 py-2 border-b text-left">Year</th>
                            <th className="px-4 py-2 border-b text-left">Semester</th>
                            <th className="px-4 py-2 border-b text-left">Class</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center">No students found</td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-4 py-2 border-b">{student.name}</td>
                                    <td className="px-4 py-2 border-b">{student.email}</td>
                                    <td className="px-4 py-2 border-b">{student.year}</td>
                                    <td className="px-4 py-2 border-b">{student.semester}</td>
                                    <td className="px-4 py-2 border-b">{student.class}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
