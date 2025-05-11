import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const mockStudents = [
    {
        id: 1,
        name: 'Alice Johnson',
        videoSrc: '/mock_videos/alice.mp4',
        lastActivity: '2 mins ago',
        isSuspicious: false,
        alerts: [],
    },
    {
        id: 2,
        name: 'Bob Smith',
        videoSrc: '/mock_videos/bob.mp4',
        lastActivity: '30 secs ago',
        isSuspicious: true,
        alerts: ['Face not visible', 'Multiple faces detected'],
    },
    {
        id: 3,
        name: 'Charlie Brown',
        videoSrc: '/mock_videos/charlie.mp4',
        lastActivity: '10 secs ago',
        isSuspicious: false,
        alerts: [],
    },
];

const ProctorExam = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Simulate fetch
        setStudents(mockStudents);
    }, []);

    return (
        <div className="flex">
            <Sidebar role="teacher" />
            <div className="ml-64 w-full bg-gray-100 min-h-screen p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">🧑‍🏫 Proctoring Live Exam</h1>
                    <p className="text-gray-600">Monitoring students in real time</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition duration-300"
                        >
                            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 bg-black">
                                <video
                                    src={student.videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    className="w-full h-full object-cover"
                                />
                                {student.isSuspicious && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                                        Suspicious
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock size={16} className="mr-1" />
                                Last activity: {student.lastActivity}
                            </div>
                            {student.alerts.length > 0 ? (
                                <div className="mt-2 text-sm text-red-600 space-y-1">
                                    {student.alerts.map((alert, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <AlertCircle className="mr-1" size={16} />
                                            {alert}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center text-green-600 text-sm">
                                    <CheckCircle className="mr-1" size={16} />
                                    No issues detected
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProctorExam;
