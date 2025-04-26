import React from 'react';
import { Link } from 'react-router-dom';

const logoUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/University_of_Cambridge_coat_of_arms.svg/1200px-University_of_Cambridge_coat_of_arms.svg.png"; // replace with your university logo URL

const Home = () => {
    return (
        <div className="w-full h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 flex items-center justify-center">
            <main className="flex flex-col md:flex-row w-full max-w-7xl bg-white rounded-3xl shadow-lg overflow-hidden h-full">

                {/* Left side with logo and image */}
                <div className="hidden md:flex flex-col w-1/2 h-full relative bg-gray-100">
                    <div className="p-6 flex items-center">
                        <img
                            src={`/images/diit.png`}
                            alt="University Logo"
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
                        alt="University campus"
                        className="flex-1 w-full object-cover"
                    />
                </div>

                {/* Right info side */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center h-full overflow-hidden">
                    {/* Logo on mobile */}
                    <div className="flex md:hidden justify-center mb-6">
                        <img
                            src={logoUrl}
                            alt="University Logo"
                            className="h-16 w-auto object-contain"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-6">
                        🎓 Welcome to Online Exam Proctoring Platform
                    </h1>
                    <p className="text-gray-700 text-base md:text-lg mb-6 md:mb-8 max-w-xl overflow-hidden">
                        Secure, smart, and simple online examination system that ensures integrity and fairness.
                        Our platform uses AI-powered proctoring with face detection, screen monitoring, and live alerts to maintain exam authenticity.
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-10 max-w-xl">
                        <div className="p-3 md:p-4 bg-green-50 rounded-xl shadow text-sm md:text-base">
                            <h3 className="font-semibold mb-1">🛡️ Secure Proctoring</h3>
                            <p>AI monitors your exam environment in real-time to prevent cheating.</p>
                        </div>
                        <div className="p-3 md:p-4 bg-blue-50 rounded-xl shadow text-sm md:text-base">
                            <h3 className="font-semibold mb-1">📱 Accessible Anywhere</h3>
                            <p>Take exams from your laptop or mobile device without hassle.</p>
                        </div>
                        <div className="p-3 md:p-4 bg-purple-50 rounded-xl shadow text-sm md:text-base">
                            <h3 className="font-semibold mb-1">⚡ Easy to Use</h3>
                            <p>Intuitive interface to help students and teachers get started quickly.</p>
                        </div>
                    </div>

                    <div className="max-w-xl mb-6 md:mb-10 overflow-hidden">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">How to Get Started</h2>
                        <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm md:text-base">
                            <li>Create your account by clicking the Register button below.</li>
                            <li>Login with your credentials to access your dashboard.</li>
                            <li>Students can join exams scheduled by teachers with live proctoring.</li>
                            <li>Teachers can create, schedule, and monitor exams easily.</li>
                            <li>Receive instant notifications if suspicious activity is detected.</li>
                        </ol>
                    </div>

                    <div className="flex flex-col gap-4 max-w-xs">
                        <Link to="/login">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-200">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-200">
                                Register
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
