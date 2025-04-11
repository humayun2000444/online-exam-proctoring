import React, { useEffect, useRef, useState } from 'react';
import { loadModels, detectFaces } from '../utils/faceDetection';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Sidebar from "./Sidebar";

const JoinExam = () => {
    const videoRef = useRef();
    const [alerts, setAlerts] = useState([]);
    const [faceCount, setFaceCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [examSubmitted, setExamSubmitted] = useState(false);

    const MAX_ALERTS = 5; // 👉 You can change threshold here

    useEffect(() => {
        const initialize = async () => {
            await loadModels(); // ✅ Wait until models are loaded
            await startCamera();
            setupTabSwitchDetection();
            const interval = setInterval(checkFace, 3000);
            return () => clearInterval(interval);
        };
        initialize();
    }, []);


    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            sendAlert("Camera permission denied or not available");
        }
    };

    const checkFace = async () => {
        const detections = await detectFaces(videoRef.current);
        setFaceCount(detections.length);

        if (detections.length === 0) sendAlert("No face detected");
        else if (detections.length > 1) sendAlert("Multiple faces detected");
    };

    const sendAlert = async (message) => {
        if (examSubmitted) return;

        setAlerts(prev => [...prev, message]);
        const newCount = alertCount + 1;
        setAlertCount(newCount);

        try {
            await axios.post("http://localhost:5000/report_proctor_alert", {
                message,
                timestamp: new Date().toISOString()
            }, {
                headers: { Authorization: getToken() }
            });
        } catch (err) {
            console.error("Failed to send alert", err);
        }

        if (newCount >= MAX_ALERTS) {
            autoSubmitExam();
        }
    };

    const autoSubmitExam = async () => {
        setExamSubmitted(true);
        alert("❗ Exam auto-submitted due to suspicious activity!");

        try {
            await axios.post("http://localhost:5000/submit_exam", {
                reason: "auto-submit: proctoring alert threshold crossed",
                timestamp: new Date().toISOString()
            }, {
                headers: { Authorization: getToken() }
            });
        } catch (err) {
            console.error("Failed to auto-submit exam", err);
        }
    };

    const setupTabSwitchDetection = () => {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) sendAlert("User switched tab or minimized window");
        });
        window.addEventListener("blur", () => {
            sendAlert("User switched window or lost focus");
        });
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-4 bg-gray-100 min-h-screen">
            <Sidebar role="student" />
            <h2 className="text-2xl font-semibold text-gray-700">Exam Proctoring in Progress...</h2>
            <video
                ref={videoRef}
                autoPlay
                muted
                width="500"
                height="300"
                className="border-2 border-gray-300 rounded-md"
            />
            <div className="flex space-x-4 mt-4">
                <h4 className="text-xl text-gray-600">Detected Faces: {faceCount}</h4>
                <h4 className="text-xl text-gray-600">Total Proctoring Alerts: {alertCount}</h4>
            </div>
            {examSubmitted && (
                <h3 className="text-xl font-bold text-red-500 mt-4">❌ Exam Auto-Submitted</h3>
            )}
            <div className="mt-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-700">Proctoring Alerts:</h3>
                <ul className="mt-2 space-y-2">
                    {alerts.map((a, i) => (
                        <li key={i} className="bg-yellow-100 p-2 rounded-md text-gray-700">
                            {a}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default JoinExam;
