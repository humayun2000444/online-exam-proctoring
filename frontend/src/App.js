import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateExam from './components/CreateExam';
import Exam from './components/ResultsPage';
import ExamForm from './components/ExamForm';
import SubmitExam from './components/SubmitExam';
import JoinExam from './components/JoinExam';
import Results from './components/Results';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import PrivateRoute from './utils/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import StudentProfile from "./components/StudentProfile";
import PoctorExam from './components/ProctorExam';

const App = () => {
    return (
        <Router>
            <Toaster />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Role-Based Dashboards */}
                <Route
                    path="/student-dashboard"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/teacher-dashboard"
                    element={
                        <PrivateRoute allowedRoles={['teacher', 'admin']}>
                            <TeacherDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/poctor-live-exam"
                    element={
                        <PrivateRoute allowedRoles={['teacher', 'admin']}>
                            <PoctorExam />
                        </PrivateRoute>
                    }
                />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />}>
                    <Route path="student/:id" element={<StudentProfile />} /> {/* Nested route */}
                </Route>

                {/* Other Protected Routes */}
                <Route
                    path="/submit-exam"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <SubmitExam />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/results"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <Results />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/exam-form"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <ExamForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/join-exam"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <JoinExam />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/resultspage"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <Exam />
                        </PrivateRoute>
                    }
                />


                <Route
                    path="/create-exam"
                    element={
                        <PrivateRoute allowedRoles={['teacher', 'admin']}>
                            <CreateExam />
                        </PrivateRoute>
                    }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
