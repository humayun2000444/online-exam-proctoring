import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import config from '../config';

const JoinExam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    startCamera();

    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 3000); // every 3 seconds

    return () => {
      stopCamera();
      clearInterval(interval);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsStreaming(true);
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach(track => track.stop());
    setIsStreaming(false);
  };

  const captureAndSendFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64Image = dataUrl.split(',')[1];

    try {
      const response = await axios.post(`${config.API_BASE_URL}/analyze`, {
        image: base64Image,
      });
      const data = response.data;
      const newAlerts = [];

      // Dummy logic for adding alerts
      if (data.suspicious_objects?.mobile_phone) newAlerts.push('📱 Mobile Phone Detected');
      if (data.facial_analysis?.no_face) newAlerts.push('❌ No Face Detected');

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  };

  // Dummy exam data
  const examData = {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  };

  return (
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar role="student" />

        {/* Main Content */}
        <div className="ml-64 w-full p-8 space-y-8 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exam Section */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Exam Question</h2>
              <p className="text-xl text-gray-600 mb-4">{examData.question}</p>
              <div className="space-y-2">
                {examData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="radio" id={`option${index}`} name="answer" value={option} className="w-4 h-4 text-blue-500" />
                      <label htmlFor={`option${index}`} className="text-lg text-gray-700">{option}</label>
                    </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                  Submit Answer
                </button>
              </div>
            </div>

            {/* Video Section */}
            <div className="relative flex justify-end">
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-xl border-4 border-blue-500">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-32 h-32 object-cover rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">🔔 Alerts</h3>
            <div className="mt-4 space-y-2">
              {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                      <div key={index} className="bg-red-100 text-red-700 px-4 py-2 rounded-md">
                        {alert}
                      </div>
                  ))
              ) : (
                  <p className="text-green-600">✅ All Clear – No Issues Detected</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default JoinExam;
