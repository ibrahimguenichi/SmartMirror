import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Button,
  Icon,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { FaUser, FaBuilding, FaPlusCircle, FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../api/auth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardData = [
    { icon: FaUser, title: 'My Profile', onClick: () => navigate('/profile') },
    { icon: FaBuilding, title: 'My Reservations', onClick: () => navigate('/reservations') },
    { icon: FaPlusCircle, title: 'New Task', onClick: () => navigate('/task') },
    { icon: FaRobot, title: 'Orange AI', onClick: () => navigate('/ai') },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        console.log('✅ Current User on Home Page:', res);
        setCurrentUser(res.data);
      } catch (error) {
        console.error('❌ Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };  
    fetchUser();
  }, []);

  const handleSignup = () => navigate('/signup');
  const handleLogin = () => navigate('/login');

  console.log('🏠 Auth User:', user);
  console.log('🏠 Current User:', currentUser);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="orange.400" />
      </Flex>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-accent">
      <Layout className="w-full mx-auto gap-6 flex flex-col min-h-screen">
        <Box borderRadius="xl" p={8} shadow="md" w="full">
          {user ? (
            <>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                justify="space-between"
                gap={6}
              >
                <Box w="80%">
                  <Heading size="lg" mb={2} fontWeight="medium">
                    Welcome back,{' '}
                    <Text as="span" className="text-orange-500" fontWeight="semibold">
                      {user?.fullname || user?.firstName || 'User'}!
                    </Text>
                  </Heading>
                  <Text className="text-orange-500" fontSize="md" color="gray.600">
                    What's on the agenda today?
                  </Text>
                </Box>
                <Avatar
                  size="xl"
                  name={user?.fullname || user?.firstName || 'User'}
                  src={user?.imgURL}
                  bg="hsl(var(--orange-primary))"
                  color="white"
                />
              </Flex>

              <Flex justify="space-between" align="center" wrap="wrap" gap={4} py={6} className="mt-10">
                {cardData.map(({ icon, title, onClick }, index) => (
                  <Box
                    key={index}
                    flex="1 1 20%"
                    minW="200px"
                    maxW="250px"
                    bg={bg}
                    border="1px solid"
                    borderColor={border}
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    boxShadow="md"
                    transition="background 0.3s ease"
                    _hover={{
                      bg: 'hsl(var(--orange-light))',
                      cursor: 'pointer',
                    }}
                    onClick={onClick}
                  >
                    <Flex direction="column" align="center" justify="space-between" gap={4}>
                      <Icon as={icon} boxSize={10} color="hsl(var(--orange-primary))" mb={4} />
                      <Heading as="h3" size="md">
                        {title}
                      </Heading>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              p={8}
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              textAlign="center"
            >
              <Heading size="lg" mb={2}>
                Welcome to the Dashboard!
              </Heading>
              <Text fontSize="md" color="gray.600" mb={4}>
                Please log in to access your personalized content.
              </Text>
              <Flex gap={4}>
                <Button colorScheme="orange" variant="solid" onClick={handleLogin}>
                  Log In
                </Button>
                <Button colorScheme="orange" variant="outline" onClick={handleSignup}>
                  Sign Up
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>

        <Box
          mt="auto"
          py={6}
          textAlign="center"
          fontSize="sm"
          position="fixed"
          bottom={8}
          left="50%"
          transform="translateX(-50%)"
        >
          Welcome to{' '}
          <Text as="span" color="orange.400">
            Orange Tunisia FabLabs
          </Text>{' '}
          — Empowering local innovation with smart technology.
        </Box>
      </Layout>
    </div>
  );
};

export default Home;
