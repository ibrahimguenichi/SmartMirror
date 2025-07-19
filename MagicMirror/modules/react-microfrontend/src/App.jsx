import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import EmailVerify from '@/pages/EmailVerify';
import ResetPassword from '@/pages/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';
import '@/App.css';
import UserProfile from './pages/UserProfile';
import Organization from './pages/Organization';
import Task from './pages/Task';
import Ai from './pages/Ai';

const App = () => {
  return (
    <div className='overflow-hidden h-full'>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/organization' element={<Organization />} />
        <Route path='/task' element={<Task />} />
        <Route path='/ai' element={<Ai />} />
        <Route path="*" element={<div className="text-mirror-text text-lg text-center mt-10">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;