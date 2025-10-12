import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

const Header = ({ className }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };
  const handleMenuClick = () => {
    navigate('/');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate("/");
    } catch(err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header
      className={twMerge(
        'w-full h-16 px-6 bg-black text-white flex justify-between items-center border-b border-orange-600/30 font-["Inter"]',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-light text-orange-500 tracking-wide">SmartMirror</h1>
          <p className="text-white/70 text-xs font-light">Orange Tunisia</p>
        </div>
      </div>
      
      <div className="text-center flex-1">
        <div className="text-white text-sm font-light font-mono tracking-wider">{time}</div>
        <div className="text-white/60 text-xs font-light">
          {new Date().toLocaleDateString('fr-TN', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setDropdownOpen((v) => !v)}>
              <span className="font-medium text-white text-sm">{user?.firstName || user?.fullname || user?.username || 'User'}</span>
              {user?.imgURL ? (
                <img
                  src={user.imgURL}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-orange-500 shadow"
                />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-orange-500 border-2 border-orange-500 shadow">
                  <span className="text-white font-bold text-lg">
                    {(user?.firstName?.[0] || user?.fullname?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg py-2 w-40 z-50 animate-fade-in">
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleMenuClick}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                >
                  Menu
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button 
              onClick={handleLoginClick}
              className="text-white text-sm font-light hover:text-orange-500 transition-colors duration-200"
            >
              Login
            </button>
            <button 
              onClick={handleSignUpClick}
              className="bg-orange-500 text-black px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;