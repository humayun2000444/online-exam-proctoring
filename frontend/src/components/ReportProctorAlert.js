import React, { useState } from 'react';
import axios from 'axios';

const ReportProctorAlert = ({ token }) => {
    const [message, setMessage] = useState('');
    const [timestamp, setTimestamp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedTimestamp = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');

            const response = await axios.post(
                '/api/exam/report_proctor_alert',
                { message, timestamp: formattedTimestamp },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
        } catch (error) {
            alert('Failed to report proctor alert');
            console.error(error);
        }
    };


    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Report Proctor Alert</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                    />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Report Alert
                </button>
            </form>
        </div>
    );
};

export default ReportProctorAlert;
