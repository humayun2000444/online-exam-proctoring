import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
            <div className="bg-white rounded-xl shadow-lg p-10 max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    🎓 Welcome to Online Exam Proctoring Platform
                </h2>
                <p className="text-gray-600 mb-8">
                    Secure, smart, and simple online examination system.
                </p>
                <div className="flex flex-col gap-4">
                    <Link to="/login">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
