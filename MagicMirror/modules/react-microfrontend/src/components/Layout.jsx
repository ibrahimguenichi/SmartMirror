import { Box, Container, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function Layout({ children }) {
  const iconBg = useColorModeValue("gray.200", "gray.700");
  const iconHoverBg = useColorModeValue("gray.300", "gray.600");

  const handleExit = () => {
    // Your exit/logout logic here
    console.log("Exit clicked");
  };

  return (
    <Box minH="100vh" minW="1024px" bg="gray.50" px={4} py={8} position="relative">
      <Container maxW="container.lg">
        {children}
      </Container>

      <Box
        position="fixed"
        bottom={4}
        left={4}
        zIndex={1000}
      >
        <IconButton
          aria-label="Exit"
          icon={<FaSignOutAlt />}
          size="lg"
          bg={iconBg}
          _hover={{ bg: "hsl(var(--orange-light))" }}
          onClick={handleExit}
          boxShadow="md"
          borderRadius="full"
        />
      </Box>
    </Box>
  );
}
