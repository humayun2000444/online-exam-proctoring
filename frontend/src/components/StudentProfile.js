import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ClipboardList, EyeOff, AlertTriangle } from 'lucide-react';

const StudentProfile = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);

    // Dummy data – replace with API call
    useEffect(() => {
        const dummyStudent = {
            id,
            name: "Ariana Clarke",
            email: "ariana@example.com",
            year: "3rd Year",
            semester: "6th",
            class: "CSE-B",
            results: [
                { exam: "Math Final", score: 88, date: "2025-04-21" },
                { exam: "AI Midterm", score: 76, date: "2025-03-15" },
                { exam: "DBMS Quiz", score: 91, date: "2025-02-10" }
            ],
            proctoringLogs: [
                { time: "2025-04-21 10:20 AM", issue: "Face not visible" },
                { time: "2025-04-21 10:42 AM", issue: "Multiple faces detected" },
                { time: "2025-04-21 11:05 AM", issue: "Suspicious movement" }
            ]
        };

        setStudent(dummyStudent);
    }, [id]);

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex">
            <Sidebar role="teacher" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>
                    <Link to="/teacher-dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
                </div>

                {/* Student Info */}
                <div className="bg-white rounded-2xl p-6 shadow space-y-3">
                    <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div><strong>Name:</strong> {student.name}</div>
                        <div><strong>Email:</strong> {student.email}</div>
                        <div><strong>Year:</strong> {student.year}</div>
                        <div><strong>Semester:</strong> {student.semester}</div>
                        <div><strong>Class:</strong> {student.class}</div>
                        <div><strong>ID:</strong> {student.id}</div>
                    </div>
                </div>

                {/* Exam Results */}
                <div className="bg-white rounded-2xl p-6 shadow">
                    <div className="flex items-center mb-4">
                        <ClipboardList className="text-green-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Exam Results</h2>
                    </div>
                    <table className="min-w-full table-auto text-sm text-gray-700">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Exam</th>
                            <th className="px-4 py-2 text-left">Score</th>
                            <th className="px-4 py-2 text-left">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {student.results.map((res, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-2">{res.exam}</td>
                                <td className="px-4 py-2">{res.score}%</td>
                                <td className="px-4 py-2">{res.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Proctoring Info */}
                <div className="bg-white rounded-2xl p-6 shadow">
                    <div className="flex items-center mb-4">
                        <AlertTriangle className="text-red-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Proctoring Alerts</h2>
                    </div>
                    {student.proctoringLogs.length === 0 ? (
                        <p className="text-gray-500">No alerts recorded.</p>
                    ) : (
                        <ul className="space-y-2">
                            {student.proctoringLogs.map((log, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-700 bg-red-50 px-4 py-2 rounded">
                                    <EyeOff className="text-red-400 mr-2 mt-1" />
                                    <span><strong>{log.time}:</strong> {log.issue}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
