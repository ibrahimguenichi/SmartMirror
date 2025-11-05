import { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Flex,
  Text,
  Avatar,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Bot, Send } from "lucide-react";
import { chat } from "../api/llm";
import { useAuth } from "../context/AuthContext";

const Ai = () => {
  const { user } = useAuth();

  // Colors (hooks must be called at the top level)
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const primary = useColorModeValue("orange.500", "orange.400");
  const aiMessageBg = useColorModeValue("white", "gray.800");
  const aiMessageColor = useColorModeValue("gray.800", "gray.100");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "ai",
      text: `Hello ${user?.firstName || "there"}! I'm your AI assistant. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chat(input, user?.id);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: response.data.response || "No response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: (Date.now() + 2).toString(),
        role: "ai",
        text: "Error contacting SmartMirror AI.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Flex direction="column" h="100vh" px={25} py={8} bg={bg}>
      {/* Header */}
      <Flex
        borderBottom="1px solid"
        borderColor={border}
        bg={cardBg}
        backdropFilter="blur(8px)"
        align="center"
        justify="center"
        py={4}
      >
        <Flex
          w="full"
          maxW="3xl"
          align="center"
          justify="space-between"
          px={6}
        >
          <Flex align="center" gap={3}>
            <Flex
              bg={primary}
              borderRadius="lg"
              w={9}
              h={9}
              align="center"
              justify="center"
            >
              <Bot size={20} color="white" />
            </Flex>
            <Box>
              <Text fontWeight="semibold">SmartMirror AI</Text>
              <Flex align="center" gap={1}>
                <Box w={2} h={2} borderRadius="full" bg={primary} />
                <Text fontSize="xs" color="gray.500">
                  Online
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* Chat Window */}
      <Flex flex="1" overflowY="auto" justify="center">
        <VStack
          w="full"
          maxW="3xl"
          px={6}
          py={8}
          spacing={6}
          align="stretch"
        >
          {messages.map((msg) => (
            <Flex
              key={msg.id}
              justify={msg.role === "user" ? "flex-end" : "flex-start"}
              gap={3}
            >
              {msg.role === "ai" && (
                <Avatar size="sm" bg={primary} color="white">
                  <Bot size={14} />
                </Avatar>
              )}

              <Box
                px={4}
                py={3}
                borderRadius="2xl"
                maxW="75%"
                bg={msg.role === "user" ? primary : aiMessageBg}
                color={msg.role === "user" ? "white" : aiMessageColor}
                border={msg.role === "user" ? "none" : `1px solid ${border}`}
                boxShadow="sm"
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {msg.text}
                </Text>
              </Box>

              {msg.role === "user" && (
                <Avatar size="sm" bg="gray.200" color="gray.700" fontSize="xs">
                  You
                </Avatar>
              )}
            </Flex>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <Flex gap={3}>
              <Avatar size="sm" bg={primary} color="white">
                <Bot size={14} />
              </Avatar>
              <Flex
                px={4}
                py={3}
                borderRadius="2xl"
                border={`1px solid ${border}`}
                bg={cardBg}
                align="center"
                gap={1}
              >
                <Box w={2} h={2} borderRadius="full" bg="gray.400" />
                <Box w={2} h={2} borderRadius="full" bg="gray.400" />
                <Box w={2} h={2} borderRadius="full" bg="gray.400" />
              </Flex>
            </Flex>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Flex>

      {/* Input Section */}
      <Flex
        borderTop="1px solid"
        borderColor={border}
        bg={cardBg}
        backdropFilter="blur(8px)"
        justify="center"
      >
        <Flex w="full" maxW="3xl" px={6} py={4} gap={2}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            bg={inputBg}
            borderColor={border}
            _focus={{
              borderColor: primary,
              boxShadow: `0 0 0 1px ${primary}`,
            }}
          />
          <Button
            onClick={sendMessage}
            isDisabled={!input.trim() || loading}
            colorScheme="orange"
            bg={primary}
            _hover={{ bg: "orange.600" }}
            px={4}
          >
            <Send size={16} />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Ai;
