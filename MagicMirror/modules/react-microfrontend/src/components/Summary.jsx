import React, { useContext } from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';
import { AppContext } from '../context/AppContext';

const Summary = () => {
  const { formData } = useContext(AppContext);

  const type = formData?.type || '- -';
  const userType = formData?.userType || '- -';
  const task = formData?.task || '- -';
  const date = formData?.date || '- -';
  const time = formData?.time || '- -';

  return (
    <Box p={4} borderWidth='1px' borderRadius='lg'>
      <Text fontSize='xl' mb={4}>
        Summary
      </Text>
      <Stack spacing={2}>
        <Text>
          <strong>Activity:</strong> {type}
        </Text>
        <Text>
          <strong>For:</strong> {userType}
        </Text>
        <Text>
          <strong>Task:</strong> {task}
        </Text>
        <Text>
          <strong>Date:</strong> {date}
        </Text>
        <Text>
          <strong>Time:</strong> {time}
        </Text>
      </Stack>
    </Box>
  );
};

export default Summary;
