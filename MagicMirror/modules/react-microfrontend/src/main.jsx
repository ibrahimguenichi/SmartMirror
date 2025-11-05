import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter basename="/home" >
      <AuthProvider>
        <ChakraProvider>
          {/* <ProtectedRoute> */}
            <App />
          {/* </ProtectedRoute> */}
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
);
}