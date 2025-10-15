import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Heading,
  Flex,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { chat } from "../api/llm";

const Ai = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await chat(input);

      setMessages([
        ...newMessages,
        { role: "ai", text: response.data.response || "No response" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "ai", text: "Error contacting LLM." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      p={6}
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        w={["100%", "600px"]}
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="lg"
        shadow="lg"
        p={6}
      >
        <Heading size="md" mb={4} textAlign="center">
          SmartMirror AI Chatbot
        </Heading>

        <VStack
          spacing={3}
          align="stretch"
          h="400px"
          overflowY="auto"
          mb={4}
          px={2}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              bg={msg.role === "user" ? "blue.100" : "gray.100"}
              alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
              borderRadius="md"
              p={3}
              maxW="80%"
              wordBreak="break-word"
            >
              <Text fontWeight="bold" mb={1}>
                {msg.role === "user" ? "You" : "AI"}
              </Text>
              <Text>{msg.text}</Text>
            </Box>
          ))}
          {loading && (
            <HStack alignSelf="flex-start" spacing={2}>
              <Spinner size="sm" />
              <Text>AI is typing...</Text>
            </HStack>
          )}
          <div ref={messagesEndRef} />
        </VStack>

        <HStack>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            bg={useColorModeValue("gray.50", "gray.600")}
          />
          <Button colorScheme="blue" onClick={sendMessage} isLoading={loading}>
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Ai;
