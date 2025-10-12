import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Container maxW="md">
        <Box
          bg={bg}
          border="1px solid"
          borderColor={border}
          borderRadius="xl"
          p={8}
          textAlign="center"
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <Box
              w={16}
              h={16}
              borderRadius="full"
              bg="red.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FaLock size={24} color="#E53E3E" />
            </Box>
            
            <VStack spacing={2}>
              <Heading size="lg" color="red.500">
                Access Denied
              </Heading>
              <Text color="gray.600" fontSize="md">
                You don't have permission to access this page.
              </Text>
            </VStack>

            <VStack spacing={3} w="full">
              <Button
                colorScheme="blue"
                onClick={handleGoBack}
                w="full"
              >
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={handleGoHome}
                w="full"
              >
                Go to Home
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Center>
  );
};

export default Unauthorized;


