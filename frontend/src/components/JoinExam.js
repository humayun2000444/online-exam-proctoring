import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import config from '../config';

const JoinExam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [alerts, setAlerts] = useState({
    alerts: [],
    gazeDirection: '',
    faceDetected: false,
    suspiciousObjects: {},
    audioAnalysis: {},
    metadata: {},
  });
  const [isStreaming, setIsStreaming] = useState(false);


  useEffect(() => {
    startCamera();

    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 3000); // every 5 seconds

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
    setAlerts({
      alerts: [],
      gazeDirection: '',
      faceDetected: false,
      suspiciousObjects: {},
      audioAnalysis: {},
      metadata: {},
    });
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

      if (data.suspicious_objects?.mobile_phone) newAlerts.push('📱 Mobile Phone Detected');
      if (data.suspicious_objects?.person && data.facial_analysis?.no_face)
        newAlerts.push('🧍 Person Detected but No Face Visible');
      if (data.facial_analysis?.multiple_faces) newAlerts.push('👥 Multiple Faces Detected');
      if (
          data.facial_analysis?.left_movement ||
          data.facial_analysis?.right_movement ||
          data.facial_analysis?.consistent_left_movement ||
          data.facial_analysis?.consistent_right_movement
      )
        newAlerts.push('👀 Head/Gaze Movement Detected');
      if (data.audio_analysis?.mouth_open) newAlerts.push('🗣️ Mouth Open (Possible Talking)');
      if (data.facial_analysis?.face_distance_change)
        newAlerts.push('↔️ Face Distance Changed');

      setAlerts({
        alerts: newAlerts,
        gazeDirection: data.facial_analysis?.gaze_direction || '',
        faceDetected: data.facial_analysis?.face_detected || false,
        suspiciousObjects: data.suspicious_objects || {},
        audioAnalysis: data.audio_analysis || {},
        metadata: data.metadata || {},
      });
    } catch (error) {
      console.error('Error sending frame:', error);
      setAlerts(prev => ({
        ...prev,
        alerts: ['⚠️ Error analyzing frame. Check your connection.']
      }));
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🎓 Exam Proctoring In Progress
        </h1>

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
          {alerts.alerts.length > 0 ? (
              <ul className="space-y-2">
                {alerts.alerts.map((alert, index) => (
                    <li
                        key={index}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded shadow"
                    >
                      {alert}
                    </li>
                ))}
              </ul>
          ) : (
              <p className="text-green-600">✅ All Clear – No Issues Detected</p>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow border">
              <h3 className="font-semibold mb-2">🧠 Facial & Audio Analysis</h3>
              <p>Face Detected: {alerts.faceDetected ? '✅ Yes' : '❌ No'}</p>
              <p>Gaze Direction: {alerts.gazeDirection || '—'}</p>
              <p>Mouth Open: {alerts.audioAnalysis.mouth_open ? '🗣️ Yes' : '🤐 No'}</p>
            </div>

            <div className="bg-white p-4 rounded shadow border">
              <h3 className="font-semibold mb-2">🎒 Suspicious Objects</h3>
              {alerts.suspiciousObjects &&
                  Object.entries(alerts.suspiciousObjects).map(([key, value]) => (
                      <p key={key}>
                        {key.replace(/_/g, ' ')}: {value ? '🚨 Detected' : '✅ Clear'}
                      </p>
                  ))}
            </div>

            <div className="bg-white p-4 rounded shadow border col-span-full">
              <h3 className="font-semibold mb-2">📝 Metadata</h3>
              <p>Status: {alerts.metadata.status || '—'}</p>
              <p>Alert: {alerts.metadata.alert || 'None'}</p>
              <p>Processing Time: {alerts.metadata.processing_time || '—'}</p>
            </div>
          </div>
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
