import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orangeLogo from '@/assets/orange_logo.svg';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {
  // const [isCreatedAccount, setIsCreatedAccount] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmitHundler = async (e) => {
    const {email, password} = formData;
    e.preventDefault();
    setIsLoading(true);
    axios.defaults.withCredentials = true;
    try {

      const response = await axios.post(`${backendURL}/auth/login`, {email, password});
      if (response.status === 200) {
        // Set authentication state
        // setUserData(response.data.user || { email });
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
        toast.success("Login successfull.")
      } else {
        toast.error("Email/Password incorrect.");
      }
    } catch(err) {
      console.error("Login failed:", err);
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <img src={orangeLogo} alt="Orange Tunisia" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 text-sm">Sign in to your SmartMirror account</p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={onSubmitHundler}>
        {/* <form className="mt-8 space-y-6"> */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
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
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/reset-password" className="text-sm text-orange-500 hover:text-orange-600 transition-colors duration-200">
              Forgot password?
            </Link>
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200">
                Sign up
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

export default Login;