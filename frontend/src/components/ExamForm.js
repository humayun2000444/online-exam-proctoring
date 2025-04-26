import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Sidebar from "./Sidebar";
import {Link} from "react-router-dom";
import config from "../config";

const ExamForm = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(900); // 15 min = 900 sec
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchQuestions();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    autoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/get_exams`, {
                headers: { Authorization: getToken() }
            });
            setQuestions(res.data.questions);
        } catch (err) {
            console.error("Failed to load questions", err);
        }
    };

    const handleOptionChange = (qId, selectedOption) => {
        setAnswers(prev => ({ ...prev, [qId]: selectedOption }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${config.API_BASE_URL}/submit_answers`, {
                answers,
                timestamp: new Date().toISOString()
            }, {
                headers: { Authorization: getToken() }
            });
            setSubmitted(true);
            alert("✅ Exam Submitted Successfully!");
        } catch (err) {
            console.error("Submission failed", err);
        }
    };

    const autoSubmit = async () => {
        if (!submitted) {
            alert("⏱️ Time is up! Auto-submitting your exam...");
            await handleSubmit();
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6 bg-gray-50 min-h-screen">
            <Sidebar role="student" />
            <h2 className="text-3xl font-semibold text-gray-800">📝 Exam Paper</h2>
            <h3 className="text-2xl font-medium text-blue-600">⏰ Time Left: {formatTime(timeLeft)}</h3>
            {!submitted ? (
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md space-y-4"
                >
                    {questions.map((q, index) => (
                        <div key={q.id} className="space-y-2">
                            <p className="font-semibold text-lg">{`Q${index + 1}: ${q.question}`}</p>
                            <div className="space-y-2 pl-4">
                                {q.options.map((opt, i) => (
                                    <label key={i} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name={`q_${q.id}`}
                                            value={opt}
                                            checked={answers[q.id] === opt}
                                            onChange={() => handleOptionChange(q.id, opt)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <Link to={'/submit-exam'}>
                    <button
                        type="submit"
                        className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        Submit Exam
                    </button></Link>
                </form>
            ) : (
                <h3 className="text-2xl font-bold text-green-600">✅ Exam Submitted. Thank you!</h3>
            )}
        </div>
    );
};

export default ExamForm;
