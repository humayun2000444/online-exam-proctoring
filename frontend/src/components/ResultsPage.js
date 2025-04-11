import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Sidebar from './Sidebar';

const ResultsPage = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await axios.get('http://localhost:5000/get_exam_results', {
                headers: { Authorization: getToken() }
            });
            setResults(res.data);
        } catch (err) {
            console.error('Failed to load results', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl font-semibold text-gray-800">Loading results...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6 space-y-6 bg-gray-50 min-h-screen">
            <Sidebar role="student" />
            <h2 className="text-3xl font-semibold text-gray-800">📊 Exam Results</h2>
            {results ? (
                <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md space-y-4">
                    <h3 className="text-2xl font-medium text-blue-600">Your Score: {results.score} / {results.totalQuestions}</h3>
                    <div className="space-y-4">
                        {results.questions.map((q, index) => (
                            <div key={q.id} className="space-y-2">
                                <p className="font-semibold text-lg">{`Q${index + 1}: ${q.question}`}</p>
                                <p className={`font-medium ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    Your answer: {q.selectedAnswer} {q.isCorrect ? '✅' : '❌'}
                                </p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        Go Back to Dashboard
                    </button>
                </div>
            ) : (
                <h3 className="text-xl font-semibold text-gray-600">You have no results available at the moment.</h3>
            )}
        </div>
    );
};

export default ResultsPage;
