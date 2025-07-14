import React, { useState, useRef, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import orangeLogo from '@/assets/orange_logo.svg';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const FaceRegistration = () => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const { backendURL } = useContext(AppContext);
    const location = useLocation();
    const userId = location.state;
    const navigate = useNavigate();

    // Start camera
    const startCamera = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Starting camera...');
            console.log('Checking if getUserMedia is supported:', !!navigator.mediaDevices?.getUserMedia);
            
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('getUserMedia is not supported in this browser');
            }
            
            // Request access to the front-facing camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user', // Front-facing camera
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            console.log('Camera stream obtained:', stream);
            streamRef.current = stream;
            
            // Set camera on - this will trigger the useEffect to setup the video
            setIsCameraOn(true);
            console.log('Camera started successfully');
            
        } catch (err) {
            console.error('Error accessing camera:', err);
            toast.error("Error accessing camera");
            
            // Reset camera state on error
            setIsCameraOn(false);
            
            // More specific error messages
            let errorMessage = 'Unable to access camera. Please make sure you have granted camera permissions.';
            
            if (err.name === 'NotAllowedError') {
                errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'No camera found on your device.';
            } else if (err.name === 'NotSupportedError') {
                errorMessage = 'Camera is not supported in this browser.';
            } else if (err.name === 'NotReadableError') {
                errorMessage = 'Camera is already in use by another application.';
            } else if (err.name === 'OverconstrainedError') {
                errorMessage = 'Camera does not meet the required constraints.';
            } else if (err.name === 'TypeError') {
                errorMessage = 'Camera access failed. Please check if you are using HTTPS.';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    // Capture photo
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to image data
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(imageData);
            
            // Don't stop the camera - keep it running for potential retake
        }
    };

    // Retake photo
    const retakePhoto = () => {
        setCapturedImage(null);
        // Camera should still be running, just clear the captured image
    };

    // Save photo (you can implement your own logic here)
    const saveEmbedding = async (e) => {
        if (capturedImage) {
            e.preventDefault();
            setIsLoading(true);

            try {
                // Convert base64 image to blob
                const base64Response = await fetch(capturedImage);
                const blob = await base64Response.blob();
                
                // Create FormData
                const formData = new FormData();
                formData.append('image', blob, 'face.jpg');
                
                formData.append('userId', userId);

                axios.defaults.withCredentials = true;
                const response = await axios.post(`${backendURL}/face-recognition/upload_face`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    console.log('Face embedding response:', response.data);
                    toast.success('Face registered successfully!');
                }
                
                navigate("/login");
            } catch (err) {
                console.error('Error uploading face:', err);
                toast.error(err.response?.data || 'Error uploading face image');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Check camera availability on mount
    useEffect(() => {
        console.log('Checking camera availability...');
        console.log('navigator.mediaDevices:', !!navigator.mediaDevices);
        console.log('getUserMedia supported:', !!navigator.mediaDevices?.getUserMedia);
        console.log('Current protocol:', window.location.protocol);
        console.log('Current hostname:', window.location.hostname);
        
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            setError('Camera access requires HTTPS. Please use HTTPS or localhost.');
        }
    }, []);

    // Handle video element when camera is turned on
    useEffect(() => {
        if (isCameraOn && streamRef.current && videoRef.current) {
            const setupVideo = async () => {
                try {
                    // Small delay to ensure video element is rendered
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                    if (videoRef.current) {
                        videoRef.current.srcObject = streamRef.current;
                        await videoRef.current.play();
                        console.log('Video element setup successfully');
                    }
                } catch (err) {
                    console.error('Error setting up video element:', err);
                    setError('Error setting up video stream');
                    setIsCameraOn(false);
                }
            };
            
            setupVideo();
        }
    }, [isCameraOn, capturedImage]);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        <img src={orangeLogo} alt="Orange Tunisia" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-3xl font-light text-gray-900 mb-2">Face Registration</h2>
                    <p className="text-gray-600 text-sm">Complete your profile setup with <span className='text-orange-500'>SmartMirror</span></p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Camera Controls */}
                        <div className="flex justify-center space-x-4">
                            {!isCameraOn && !capturedImage && (
                                <button
                                    onClick={startCamera}
                                    disabled={isLoading}
                                    className="bg-orange-500 text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Starting Camera...
                                        </div>
                                    ) : (
                                        'Start Camera'
                                    )}
                                </button>
                            )}
                            
                            {isCameraOn && (
                                <button
                                    onClick={stopCamera}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                >
                                    Stop Camera
                                </button>
                            )}
                        </div>

                        {/* Video Preview */}
                        {isCameraOn && !capturedImage && (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    className="w-full max-w-md mx-auto border-2 border-gray-300 rounded-lg shadow-sm"
                                    autoPlay
                                    playsInline
                                    muted
                                />
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={capturePhoto}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        📸 Capture Photo
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Captured Image */}
                        {capturedImage && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <img
                                        src={capturedImage}
                                        alt="Captured face"
                                        className="w-full max-w-md mx-auto border-2 border-gray-300 rounded-lg shadow-sm"
                                    />
                                </div>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={retakePhoto}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                    >
                                        🔄 Retake Photo
                                    </button>
                                    <button
                                        onClick={saveEmbedding}
                                        disabled = {isLoading}
                                        className="bg-orange-500 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                                    >
                                        Add Face
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        {!isCameraOn && !capturedImage && (
                            <div className="text-center text-gray-600">
                                <p className="mb-6 text-lg">
                                    Click "Start Camera" to begin face registration.
                                </p>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Instructions:</h3>
                                    <ul className="text-sm text-gray-700 space-y-2">
                                        <li className="flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Make sure you're in a well-lit area
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Position your face in the center of the camera
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Look directly at the camera
                                        </li>
                                        <li className="flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Keep your face clearly visible
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Hidden canvas for capturing */}
                        <canvas
                            ref={canvasRef}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Powered by{' '}
                        <span className="text-orange-500 font-medium">Orange Tunisia</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FaceRegistration;