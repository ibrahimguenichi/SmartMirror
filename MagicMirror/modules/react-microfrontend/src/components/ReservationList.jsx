import { useState, useContext } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const MotionCard = motion(Card);

// --- Confirmation Modal as a child component ---
function ConfirmCancelModal({ isOpen, onClose, reservationId, onSuccess }) {
  const { backendURL } = useContext(AppContext);

  const handleConfirm = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.delete(`${backendURL}/reservation/${reservationId}`);
      if (response.status === 200 || response.status === 204) {
        onSuccess(reservationId);   // tell parent to remove the item
        onClose();
      }
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cancel Reservation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to cancel this reservation?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleConfirm}>
            Yes, Cancel
          </Button>
          <Button variant="ghost" onClick={onClose}>
            No, Keep it
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function ReservationList({ reservations, setReservations }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState(null);
  const { backendURL } = useContext(AppContext);

  // When user clicks the "Cancel" button on a card:
  const handleCancelClick = (id) => {
    setSelectedId(id);
    onOpen(); // opens the modal
  };

  // Remove the reservation from local state after successful deletion
  const removeReservation = async (id) => {
    try {
    // Send DELETE request
    const response = await axios.delete(`${backendURL}/reservation/${id}`);

    if (response.status === 200 || response.status === 204) {
      // Remove from local state
      setReservations((prev) => prev.filter((res) => res.id !== id));
      console.log(`Reservation ${id} cancelled successfully.`);
    } else {
      console.error(`Failed to cancel reservation ${id}. Status: ${response.status}`);
    }
  } catch (err) {
    console.error('Error cancelling reservation:', err);
  }
  };

  return (
    <Box p={6}>
      <SimpleGrid columns={[1, 1, 2, 3]} spacing={6}>
        {reservations.map((reservation) => (
          <MotionCard
            key={reservation.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            borderRadius="xl"
            boxShadow="lg"
            p={5}
            minH="200px"
          >
            <CardBody>
              <Stack spacing={3}>
                <Heading size="md">{reservation.activity}</Heading>
                <Text>Task: {reservation.task}</Text>
                <Text>Age Group: {reservation.ageGroup}</Text>
                <Text>Date: {reservation.date}</Text>
                <Text>Time: {reservation.startTime}</Text>
                <Text>Duration: {reservation.duration}</Text>
                <Badge>{reservation.status}</Badge>

                <Button
                  colorScheme="red"
                  mt={2}
                  onClick={() => handleCancelClick(reservation.id)}
                >
                  Cancel
                </Button>
              </Stack>
            </CardBody>
          </MotionCard>
        ))}
      </SimpleGrid>

      {/* Confirmation Modal */}
      <ConfirmCancelModal
        isOpen={isOpen}
        onClose={onClose}
        reservationId={selectedId}
        onSuccess={removeReservation}
      />
    </Box>
  );
}
