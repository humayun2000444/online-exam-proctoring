import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Results = ({ token, role }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(
                    role === 'admin' ? '/api/exam/admin/results' : '/api/exam/student/results',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setResults(response.data);
            } catch (error) {
                alert('Failed to fetch results');
            }
        };

        fetchResults();
    }, [token, role]);

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Exam Results</h2>
            <ul>
                {results.length > 0 ? (
                    results.map((result) => (
                        <li key={result.id} className="mb-2">
                            <div className="font-semibold">{result.exam_title}</div>
                            <div>{result.score}</div>
                        </li>
                    ))
                ) : (
                    <div>No results available</div>
                )}
            </ul>
        </div>
    );
};

export default Results;
