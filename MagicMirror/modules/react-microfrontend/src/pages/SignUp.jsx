import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orangeLogo from '@/assets/orange_logo.svg';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUp = () => {
  // Form stage state
  const [currentStage, setCurrentStage] = useState('form'); // 'form' or 'face-registration'
  const [createdUserId, setCreatedUserId] = useState(null);
  
  // Form state
  const [userType, setUserType] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
    age: '',
    sexe: '',
    trainingLocation: '',
    password: '',
    confirmPassword: '',
    // Client specific fields
    role: '',
    // Employee specific fields
    position: '',
    department: '',
    startDate: ''
  });

  // Face registration state
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isFaceLoading, setIsFaceLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true;
      let response;
      if (userType === 'client') {
        const client_data = {
          "email": formData.email,
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "phoneNum": formData.phoneNum,
          "age": formData.age,
          "sexe": formData.sexe,
          "trainingLocation": formData.trainingLocation,
          "password": formData.password,
          "confirmPassword": formData.confirmPassword,
          "role": formData.role,
        }
        console.log("ssss")
        response = await axios.post(`https://minnow-blessed-usually.ngrok-free.app/api/users/client`, client_data);
        console.log(response)
      } else if(userType === 'employee') {
        const employee_data = {
          "email": formData.email,
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "phoneNum": formData.phoneNum,
          "age": formData.age,
          "sexe": formData.sexe,
          "trainingLocation": formData.trainingLocation,
          "password": formData.password,
          "confirmPassword": formData.confirmPassword,
          "position": formData.position,
          "department": formData.department,
          "startDate": formData.startDate
        }
        response = await axios.post(`https://minnow-blessed-usually.ngrok-free.app/api/users/employee`, employee_data);
      }
      if (response && response.status === 200) {
        const userId = response.data.id;
        setCreatedUserId(userId);
        // Upload profile image if selected
        if (profileImage) {
          const formDataImg = new FormData();
          formDataImg.append('file', profileImage);
          try {
            const uploadRes = await axios.post(`https://minnow-blessed-usually.ngrok-free.app/api/users/${userId}/profile-image`, formDataImg, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (uploadRes.status === 200) {
              toast.success('Profile image uploaded successfully!');
            }
          } catch (err) {
            toast.error('Profile image upload failed.');
            console.error(err.message);
          }
        }
        setCurrentStage('face-registration');
        toast.success("Account created successfully. Now let's register your face!");
      } else if (response && response.status === 422) {
        response.data.errors.map((error) => {toast.error(error)});
      }
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    }
    setIsLoading(false);
  };

  // Face registration functions
  const startCamera = async () => {
    try {
      setIsFaceLoading(true);
      setError(null);
      
      console.log('Starting camera...');
      console.log('Checking if getUserMedia is supported:', !!navigator.mediaDevices?.getUserMedia);
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      
      setIsCameraOn(true);
      console.log('Camera started successfully');
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error("Error accessing camera");
      
      setIsCameraOn(false);
      
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
      setIsFaceLoading(false);
    }
  };

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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const saveEmbedding = async (e) => {
    if (capturedImage) {
      e.preventDefault();
      setIsFaceLoading(true);

      try {
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        
        const formData = new FormData();
        formData.append('image', blob, 'face.jpg');
        formData.append('userId', createdUserId);

        axios.defaults.withCredentials = true;
        console.log('aaaa')
        const response = await axios.post(`https://minnow-blessed-usually.ngrok-free.app/api/face-recognition/upload_face`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('bbbb')
        if (response.status === 200) {
          console.log('Face embedding response:', response.data);
          toast.success('Face registered successfully!');
          navigate("/login");
        }
        
      } catch (err) {
        console.error('Error uploading face:', err);
        toast.error(err.response?.data || 'Error uploading face image');
      } finally {
        setIsFaceLoading(false);
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

  const goBackToForm = () => {
    setCurrentStage('form');
    setCapturedImage(null);
    stopCamera();
  };

  const departments = [
    'IT',
    'HR',
    'FINANCE',
    'MARKETING',
    'SALES',
    'OPERATIONS',
    'CUSTOMER_SERVICE'
  ];

  const clientRoles = [
    'ETUDIANT',
    'ENSEIGNANT_FORMATTEUR',
    'PROFESSIONEL',
    'PORTEUR_PROJET_ARTISANAL',
    'ENTREPRENEUR',
    'AU_CHAOMAGE'
  ];

  // Render face registration stage
  if (currentStage === 'face-registration') {
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
                    disabled={isFaceLoading}
                    className="bg-orange-500 text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    {isFaceLoading ? (
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
                      disabled={isFaceLoading}
                      className="bg-orange-500 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                    >
                      {isFaceLoading ? 'Processing...' : 'Complete Registration'}
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

              {/* Back to form button */}
              <div className="text-center pt-4">
                <button
                  onClick={goBackToForm}
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  ← Back to form
                </button>
              </div>

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
  }

  // Render signup form stage
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <img src={orangeLogo} alt="Orange Tunisia" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600 text-sm">Join SmartMirror powered by <span className='text-orange-500'>Orange Tunisia</span></p>
        </div>

        {/* User Type Selection */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setUserType('client')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              userType === 'client'
                ? 'bg-orange-500 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setUserType('employee')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              userType === 'employee'
                ? 'bg-orange-500 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Employee
          </button>
        </div>

        {/* Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Image Upload */}
            <div className="md:col-span-2 flex flex-col items-center mb-2">
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Profile Picture (optional)
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 mt-2"
                />
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your last name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNum" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Phone number
              </label>
              <input
                id="phoneNum"
                name="phoneNum"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phoneNum}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="10"
                max="100"
                required
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your age"
              />
            </div>

            {/* Sexe */}
            <div>
              <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Gender
              </label>
              <select
                id="sexe"
                name="sexe"
                required
                value={formData.sexe}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Training Location */}
            <div className="md:col-span-2">
              <label htmlFor="trainingLocation" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Training location
              </label>
              <input
                id="trainingLocation"
                name="trainingLocation"
                type="text"
                required
                value={formData.trainingLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your training location"
              />
            </div>

            {/* Client Role (only for clients) */}
            {userType === 'client' && (
              <div className="md:col-span-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900"
                >
                  <option value="">Select your role</option>
                  {clientRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Employee specific fields */}
            {userType === 'employee' && (
              <>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your position"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    Start date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength="8"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must contain uppercase, lowercase, digit, and special character
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-black py-3 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </form>

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

export default SignUp;