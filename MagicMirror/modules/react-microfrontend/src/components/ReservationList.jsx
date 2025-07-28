import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Animate card using framer-motion
const MotionCard = motion(Card);

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'CANCELED':
      return 'red';
    case 'NOT_COMPLETED':
    default:
      return 'orange';
  }
};

// Single reservation card
const ReservationCard = ({ reservation }) => {
  return (
    <MotionCard
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      borderRadius="xl"
      boxShadow="lg"
      bg={useColorModeValue('whiteAlpha.200', 'gray.700')}
      p={5}
      minH="200px"
      cursor="pointer"
    >
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md" textTransform="capitalize">
            {reservation.activity.replace(/_/g, ' ').toLowerCase()}
          </Heading>
          <Text fontSize="lg">Task: {reservation.task.replace(/_/g, ' ')}</Text>
          <Text fontSize="lg">Age Group: {reservation.ageClass}</Text>
          <Text fontSize="lg">Date: {reservation.date}</Text>
          <Text fontSize="lg">Time: {reservation.startTime}</Text>
          <Text fontSize="lg">Duration: {formatDuration(reservation.duration)}</Text>
          <Badge
            colorScheme={getStatusColor(reservation.status)}
            fontSize="1em"
            px={3}
            py={1}
            borderRadius="md"
            alignSelf="flex-start"
          >
            {reservation.status.replace(/_/g, ' ')}
          </Badge>
        </Stack>
      </CardBody>
    </MotionCard>
  );
};

// Format ISO-8601 duration (PT1H30M) to readable
function formatDuration(duration) {
  if (!duration) return '';
  const hours = duration.match(/(\d+)H/);
  const minutes = duration.match(/(\d+)M/);
  return `${hours ? hours[1] + 'h ' : ''}${minutes ? minutes[1] + 'min' : ''}`.trim();
}

// Full reservation list
export default function ReservationList({ reservations }) {
  return (
    <Box p={6}>
      <SimpleGrid columns={[1, 1, 2, 3]} spacing={6}>
        {reservations.map((reservation, idx) => (
          <ReservationCard key={idx} reservation={reservation} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
