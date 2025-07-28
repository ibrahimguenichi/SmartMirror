import { VStack, Text, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import RadioCard from './RadioCard';

const options = [
  { value: 'FABRICATION_3D', label: 'Fabrication 3D' },
  { value: 'COUPE_LASER', label: 'Coupe Laser' },
  { value: 'FABRICATION_ELECTRONIQUE', label: 'Fabrication Electronique' },
  { value: 'CONCEPTION', label: 'Conception' },
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
