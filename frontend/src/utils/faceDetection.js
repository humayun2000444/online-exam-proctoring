// src/utils/faceDetection.js

import * as faceapi from 'face-api.js';

export const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
};

export const detectFaces = async (videoElement) => {
    const detections = await faceapi.detectAllFaces(
        videoElement,
        new faceapi.TinyFaceDetectorOptions()
    );
    return detections;
};
