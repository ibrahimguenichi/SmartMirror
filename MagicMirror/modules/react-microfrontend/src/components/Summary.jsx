import { VStack, Text, Box } from '@chakra-ui/react';

export default function Summary({ data }) {
  return (
    <VStack align='start' spacing={2}>
      <Text fontSize='lg'>
        <strong>Activity:</strong> {data.activity || '- -'}
      </Text>
      <Text fontSize='lg'>
        <strong>For:</strong> {data.ageGroup || '- -'}
      </Text>
      <Text fontSize='lg'>
        <strong>Task:</strong> {data.task || '- -'}
      </Text>
      <Text fontSize='lg'>
        <strong>Date:</strong> {data.date || '- -'}
      </Text>
      <Text fontSize='lg'>
        <strong>Time:</strong> {data.startTime || '- -'}
      </Text>
    </VStack>
  );
}
