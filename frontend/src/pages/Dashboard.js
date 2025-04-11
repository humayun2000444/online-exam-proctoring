import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getUserRole, logout } from '../utils/auth'; // Assuming you have a logout function

const Dashboard = () => {
    const role = getUserRole();

    if (!role) return <Navigate to="/login" />;

    const menuItems = {
        student: [
            { name: 'Join Exam', path: '/join-exam' },
            { name: 'Exam Form', path: '/exam-form' },
        ],
        teacher: [
            { name: 'Create Exam', path: '/create-exam' },
            { name: 'Manage Students', path: '/teacher-dashboard' },
        ],
        admin: [
            { name: 'Create Exam', path: '/create-exam' },
            { name: 'Teacher Panel', path: '/teacher-dashboard' },
            { name: 'Student Panel', path: '/student-dashboard' },
        ],
    };

    const userMenu = menuItems[role] || [];

    const handleLogout = () => {
        logout(); // Logout functionality (clear session, token, etc.)
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg border-r border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-8">📚 {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
                <nav className="flex flex-col gap-4">
                    {userMenu.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-4 py-2 rounded-md transition"
                        >
                            {item.name}
                        </Link>
                    ))}
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 mt-4 rounded-md transition"
                    >
                        🚪 Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to your Dashboard</h1>
                <p className="text-gray-600">Select an option from the sidebar to continue.</p>
            </main>
        </div>
    );
};

export default Dashboard;
