import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const JoinExam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [alerts, setAlerts] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    startCamera();

    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 5000); // every 5 seconds

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
      const response = await axios.post('http://localhost:5000/analyze', {
        image: base64Image
      });

      const { mob_status, person_status, user_move1, user_move2 } = response.data;
      const newAlerts = [];

      if (mob_status) newAlerts.push('📱 Mobile Phone Detected');
      if (person_status) newAlerts.push('🧍 Multiple Persons Detected');
      if (user_move1 || user_move2) newAlerts.push('👀 Gaze Deviation Detected');

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🎓 Exam Proctoring In Progress</h1>

      <div className="relative w-full max-w-3xl rounded-lg overflow-hidden shadow-xl border border-gray-300 bg-white">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full aspect-video object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">🔔 Alerts</h2>
        {alerts.length > 0 ? (
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">
                {alert}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600">✅ All Clear – No Issues Detected</p>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={stopCamera}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded"
        >
          ❌ Stop Proctoring
        </button>
      </div>
    </div>
  );
};

export default JoinExam;
