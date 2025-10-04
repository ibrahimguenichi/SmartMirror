import { useEffect, useState, useContext } from 'react';
import { VStack, Text, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import RadioCard from './RadioCard';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export default function TimeSelect({ onSelect, value, date, refreshFlag }) {
  const [options, setOptions] = useState([]);
  const { backendURL } = useContext(AppContext);

  useEffect(() => {
    if (!date) {
      setOptions([]);
      return;
    }

    axios
      .get(`${backendURL}/reservation/available-times?date=${date}`)
      .then((res) => setOptions(res.data))
      .catch((err) => console.error('Erreur récupération heures disponibles:', err));
  }, [date, backendURL, refreshFlag]); // 🔥 refreshFlag déclenche la mise à jour

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'time',
    value,
    onChange: onSelect,
  });

  const group = getRootProps();

  return (
    <VStack align="start">
      <Text fontSize="xl" fontWeight="bold">
        Choose the time
      </Text>
      <SimpleGrid columns={[1, 3]} spacing={4} {...group}>
        {options.length > 0 ? (
          options.map((option) => {
            const radio = getRadioProps({ value: option });
            return (
              <RadioCard key={option} {...radio}>
                {option}
              </RadioCard>
            );
          })
        ) : (
          <Text fontSize="md" color="gray.500">
            No available times for this date
          </Text>
        )}
      </SimpleGrid>
    </VStack>
  );
}
