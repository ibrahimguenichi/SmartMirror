import { VStack, Text, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import RadioCard from './RadioCard';

const options = [
  { value: 'OpenLab', label: 'OpenLab' },
  { value: 'Workshop', label: 'Atelier' },
  { value: 'Accompagnement', label: 'Accompagnement' },
];

export default function ActivitySelect({ onSelect, value }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'stepType',
    value,
    onChange: onSelect,
  });

  const group = getRootProps();

  return (
    <VStack align='start'>
      <Text fontSize='xl' fontWeight='bold'>
        Choose the activity
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing={4} {...group}>
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
