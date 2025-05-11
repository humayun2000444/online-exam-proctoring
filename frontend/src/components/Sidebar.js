import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
    const location = useLocation();

    const menuItemClass = (path) =>
        `block py-2 px-4 rounded hover:bg-gray-700 transition ${
            location.pathname === path ? 'bg-gray-700' : ''
        }`;

    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-6 fixed top-0 left-0 shadow-lg">
            <div className="text-center mb-6">
                <img
                    src="/images/diit.png"
                    alt="Logo"
                    className="h-16 mx-auto mb-2"
                />
            </div>

            <ul className="space-y-2">
                {role === 'student' && (
                    <>
                        <li><Link to="/student-dashboard" className={menuItemClass('/student-dashboard')}>Home</Link></li>
                        <li><Link to="/join-exam" className={menuItemClass('/join-exam')}>Join Exam</Link></li>
                        <li><Link to="/resultspage" className={menuItemClass('/resultspage')}>Results Page</Link></li>
                    </>
                )}

                {role === 'teacher' && (
                    <>
                        <li><Link to="/teacher-dashboard" className={menuItemClass('/teacher-dashboard')}>Home</Link>
                        </li>
                        <li><Link to="/poctor-live-exam" className={menuItemClass('/poctor-live-exam')}>Live Exam</Link></li>
                        <li><Link to="/create-exam" className={menuItemClass('/create-exam')}>➕ Create Exam</Link></li>
                    </>
                )}

                {role === 'admin' && (
                    <>
                    <li><Link to="/create-exam" className={menuItemClass('/create-exam')}>➕ Create Exam</Link></li>
                        <li><Link to="/teacher-dashboard" className={menuItemClass('/teacher-dashboard')}>📋 Teacher Dashboard</Link></li>
                        <li><Link to="/student-dashboard" className={menuItemClass('/student-dashboard')}>📚 Student Dashboard</Link></li>
                    </>
                )}

                <li className="mt-4 pt-4 border-t border-gray-700">
                    <Link to="/" className="block py-2 px-4 text-red-400 hover:text-red-300 hover:bg-red-800 rounded transition">
                        🚪 Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
