import {
  Box,
  Container,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '@/components/Header';

export default function Layout({ children, maxW = 'container.lg' }) {
  const iconBg = useColorModeValue('gray.200', 'gray.700');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleExit = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div>
      <Header />

      <Box
        id='scrollable-container'
        minH='100vh'
        bg='gray.50'
        px={4}
        py={8}
        position='relative'
        overflow='auto'
      >
        <Container maxW={maxW}>{children}</Container>
      </Box>

      <Box position='fixed' bottom={4} left={4} zIndex={1000}>
        <IconButton
          aria-label='Exit'
          icon={<FaSignOutAlt />}
          size='lg'
          bg={iconBg}
          _hover={{ bg: 'hsl(var(--orange-light))' }}
          onClick={handleExit}
          boxShadow='md'
          borderRadius='full'
        />
      </Box>
    </div>
  );
}
