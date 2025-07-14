import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { AppContext } from '../context/AppContext';

const Home = () => {
  const { userData, setIsLoggedIn, setUserData, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    // Clear window.userData if it exists
    if (window.userData) {
      delete window.userData;
    }
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-accent">
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center text-mirror-text text-lg p-8">
        {isLoggedIn ? (
          // Logged in content
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-light text-orange-500">
              Welcome, {userData?.username || userData?.firstName || 'User'}!
            </h1>
            <p className="text-white/70 text-lg">
              You have successfully logged in to SmartMirror
            </p>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <p className="text-white/80">User ID: {userData?.id || 'N/A'}</p>
                <p className="text-white/80">Username: {userData?.username || userData?.firstName || 'N/A'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          // Default content when not logged in
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-light text-orange-500">
              Welcome to SmartMirror
            </h1>
            <p className="text-white/70 text-lg">
              Your intelligent mirror experience powered by Orange Tunisia
            </p>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <p className="text-white/80">Please login or sign up to access your personalized dashboard</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;