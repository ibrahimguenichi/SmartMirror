import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import EmailVerify from '@/pages/EmailVerify';
import ResetPassword from '@/pages/ResetPassword';
import Unauthorized from '@/pages/Unauthorized';
import 'react-toastify/dist/ReactToastify.css';
import '@/App.css';
import UserProfile from './pages/UserProfile';
import Task from './pages/Task';
import Ai from './pages/Ai';
import AdminDashboard from './pages/AdminDashboard';
import 'react-datepicker/dist/react-datepicker.css';
import Reservations from './pages/Reservations';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

const App = () => {
  return (
    <div className='overflow-hidden h-full'>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        
        {/* Role-based redirect route */}
        {/* <Route path='/redirect' element={<RoleBasedRedirect />} /> */}
        
        {/* Admin only routes */}
        <Route path='/admin' element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        
        {/* User routes */}
        <Route path='/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path='/reservations' element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        <Route path='/task' element={<ProtectedRoute><Task /></ProtectedRoute>} />
        <Route path='/ai' element={<ProtectedRoute><Ai /></ProtectedRoute>} />
        
        <Route
          path='*'
          element={
            <div className='text-mirror-text text-lg text-center mt-10'>
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
