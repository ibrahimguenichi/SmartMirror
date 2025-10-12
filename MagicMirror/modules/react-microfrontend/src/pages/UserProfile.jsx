import { VStack, Avatar, Text, Box, Center } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Center h="100vh">
        <Text fontSize="xl">Chargement du profil...</Text>
      </Center>
    );
  }

  return (
    <Center h="100vh" bg="gray.50">
      <Box
        p={10}
        bg="white"
        borderRadius="2xl"
        shadow="2xl"
        maxW="600px"
        w="100%"
        textAlign="center"
      >
        <Avatar
          size="2xl"
          name={`${user.firstName || user.fullname} ${user.lastName || ''}`}
          src={user.imgURL || user.profileImageUrl}
          mb={6}
        />
        <VStack spacing={4}>
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            {user.firstName || user.fullname} {user.lastName || ''}
          </Text>
          <Text fontSize="lg" color="gray.600">
            📧 {user.email}
          </Text>
          <Text fontSize="lg" color="gray.600">
            📞 {user.phoneNum || user.phone}
          </Text>
        </VStack>
      </Box>
    </Center>
  );
}
