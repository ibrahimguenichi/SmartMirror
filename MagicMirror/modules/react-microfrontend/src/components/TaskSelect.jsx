import { VStack, Text, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import RadioCard from './RadioCard';

const options = [
  { value: 'Fabrication 3D', label: 'Fabrication 3D' },
  { value: 'Coupe Laser', label: 'Coupe Laser' },
  { value: 'Fabrication Electronique', label: 'Fabrication Electronique' },
  { value: 'Conception', label: 'Conception' },
];

export default function TaskSelect({ onSelect, value }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'task',
    value,
    onChange: onSelect,
  });

  const group = getRootProps();

  return (
    <VStack align='start'>
      <Text fontSize='xl' fontWeight='bold'>
        Choose the task
      </Text>
      <SimpleGrid columns={[1, 2]} spacing={4} {...group}>
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
