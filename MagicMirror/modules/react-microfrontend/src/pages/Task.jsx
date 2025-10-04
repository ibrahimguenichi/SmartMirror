import { useState, useContext } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  VStack,
  Stack,
} from '@chakra-ui/react';
import Layout from '../components/Layout';

import ActivitySelect from '../components/ActivitySelect';
import AudienceSelect from '../components/AudienceSelect';
import TaskSelect from '../components/TaskSelect';
import DateSelect from '../components/DateSelect';
import TimeSelect from '../components/TimeSelect';
import Summary from '../components/Summary';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Task() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    activity: '',
    ageGroup: '',   // ✅ Corrected
    task: '',
    date: '',
    startTime: '',
    duration: 'PT1H',
  });

  const { backendURL, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const isFormComplete = Object.values(formData).every((value) => value !== '');

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRestart = () => {
    setFormData({
      activity: '',
      ageGroup: '',   // ✅ Reset correctly
      task: '',
      date: '',
      startTime: '',
      duration: 'PT1H',
    });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Sending reservation:", {...formData, clienId: userData.id});
      const response = await axios.post(`${backendURL}/reservation`, {...formData, clientId: userData.id}, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response && response.status === 200) {
        toast.success('Reservation added successfully');
        navigate('/');
      } else if (response.data.errors) {
        response.data.errors.forEach((error) => toast.error(error));
      }
    } catch (err) {
      console.error('Reservation failed', err);
      toast.error('Reservation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout maxW='80%'>
      <Card mx='auto' mt={6} mb={6} boxShadow='lg' borderRadius='xl' width='100%'>
        <CardBody p={8}>
          <Flex direction='row' gap={8}>
            {/* Left Side: Form Steps */}
            <Stack spacing={6} flex='2'>
              <ActivitySelect
                value={formData.activity}
                onSelect={(val) => handleSelect('activity', val)}
              />

              <AudienceSelect
                value={formData.ageGroup}   // ✅ Corrected
                onSelect={(val) => handleSelect('ageGroup', val)}
              />

              <TaskSelect
                value={formData.task}
                onSelect={(val) => handleSelect('task', val)}
              />

              <Flex direction='row' gap={6}>
                <DateSelect
                  value={formData.date}
                  onChange={(date) => {
                    if (!date) return;
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const formattedDate = `${yyyy}-${mm}-${dd}`;
                    handleSelect('date', formattedDate);
                  }}
                />

                <TimeSelect
                  value={formData.startTime}      // ✅ Corrected
                  onSelect={(val) => handleSelect('startTime', val)}
                  date={formData.date}            // ✅ Pass date to fetch available times
                />
              </Flex>
            </Stack>

            {/* Right Side: Summary and Buttons */}
            <Box flex='1' borderLeft='1px solid' borderColor='gray.300' pl={4}>
              <VStack spacing={4} align='stretch'>
                <Summary data={formData} />
                <Button colorScheme='gray' onClick={handleRestart}>
                  Restart
                </Button>
                <Button
                  colorScheme='orange'
                  isDisabled={!isFormComplete}
                  onClick={handleConfirm}
                  isLoading={isLoading}
                >
                  Confirm
                </Button>
              </VStack>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Layout>
  );
}
