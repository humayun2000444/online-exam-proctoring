// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Login from './components/Login';
// import Register from './components/Register';
// import CreateExam from './components/CreateExam';
// import Exam from './components/ResultsPage';
// import ExamForm from './components/ExamForm';
// import SubmitExam from './components/SubmitExam';
// import JoinExam from './components/JoinExam';
// import Results from './components/Results';
// import StudentDashboard from './pages/StudentDashboard';
// import TeacherDashboard from './pages/TeacherDashboard';
// import PrivateRoute from './utils/PrivateRoute';
// import { getUserRole } from './utils/auth';
//
// const App = () => {
//     const userRole = getUserRole();
//
//     return (
//         <Router>
//             <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//
//                 {/* Protected Routes */}
//                 <Route
//                     path="/dashboard"
//                     element={
//                         <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
//                             <Dashboard />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/student-dashboard"
//                     element={
//                         <PrivateRoute allowedRoles={['student']}>
//                             <StudentDashboard />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/submit-exam"
//                     element={
//                         <PrivateRoute allowedRoles={['student']}>
//                             <SubmitExam />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/results"
//                     element={
//                         <PrivateRoute allowedRoles={['student']}>
//                             <Results />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/teacher-dashboard"
//                     element={
//                         <PrivateRoute allowedRoles={['teacher', 'admin']}>
//                             <TeacherDashboard />
//                         </PrivateRoute>
//                     }
//                 />
//
//                 <Route
//                     path="/exam-form"
//                     element={
//                         <PrivateRoute allowedRoles={['student']}>
//                             <ExamForm />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/join-exam"
//                     element={
//                         <PrivateRoute allowedRoles={['student']}>
//                             <JoinExam />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/resultspage"
//                     element={
//                         <PrivateRoute allowedRoles={['student']}>
//                             <Exam />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/create-exam"
//                     element={
//                         <PrivateRoute allowedRoles={['teacher', 'admin']}>
//                             <CreateExam />
//                         </PrivateRoute>
//                     }
//                 />
//
//                 {/* Catch-all for unknown routes */}
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </Router>
//     );
// };
//
// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreateExam from './components/CreateExam';
import Exam from './components/ResultsPage';
import ExamForm from './components/ExamForm';
import SubmitExam from './components/SubmitExam';
import JoinExam from './components/JoinExam';
import Results from './components/Results';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import PrivateRoute from './utils/PrivateRoute';

const App = () => {
    return (
        <Router>
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
