import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx';
import { ChakraProvider } from '@chakra-ui/react'

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter basename="/home" >
      <AppContextProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </AppContextProvider>
    </BrowserRouter>
);
}

// const container = document.getElementById('root');
// if (container) {
//   const root = createRoot(container);
//   root.render(
//     <BrowserRouter basename="/home">
//       <AppContextProvider>
//         <App />
//       </AppContextProvider>
//     </BrowserRouter>
// );
// }
