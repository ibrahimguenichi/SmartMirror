import { useEffect, useState } from "react";
import { VStack, Avatar, Text, Box, Center } from "@chakra-ui/react";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Erreur récupération user:", err));
  }, []);

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
          name={`${user.firstName} ${user.lastName}`}
          src={user.profileImageUrl || undefined}
          mb={6}
        />
        <VStack spacing={4}>
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            {user.firstName} {user.lastName}
          </Text>
          <Text fontSize="lg" color="gray.600">
            📧 {user.email}
          </Text>
          <Text fontSize="lg" color="gray.600">
            📞 {user.phoneNum}
          </Text>
        </VStack>
      </Box>
    </Center>
  );
}
