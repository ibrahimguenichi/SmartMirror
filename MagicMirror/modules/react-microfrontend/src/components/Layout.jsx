import { Box, Container, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import Header from '@/components/Header';

export default function Layout({ children, maxW = "container.lg" }) {
  const iconBg = useColorModeValue("gray.200", "gray.700");

  const handleExit = () => {
    // Your exit/logout logic here
    console.log("Exit clicked");
  };

  return (
    <div>
      <Header />
    
      <Box minH="100vh" bg="gray.50" px={4} py={8} position="relative">
        <Container maxW={maxW}>
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
    </div>
  );
}
