import { VStack, Text, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import RadioCard from './RadioCard';

const options = [
  { value: '10:00', label: '10:00' },
  { value: '14:00', label: '14:00' },
  { value: '17:00', label: '17:00' },
];

export default function TimeSelect({ onSelect, value }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'time',
    value,
    onChange: onSelect,
  });

  const group = getRootProps();

  return (
    <VStack align='start'>
      <Text fontSize='xl' fontWeight='bold'>
        Choose the time
      </Text>
      <SimpleGrid columns={[1, 3]} spacing={4} {...group}>
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard key={option.value} {...radio}>
              {option.label}
            </RadioCard>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}
