import { VStack, Text, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import RadioCard from './RadioCard';

const options = [
  { value: 'Adult', label: 'Adult' },
  { value: 'Kid', label: 'Kid' },
];

export default function AudienceSelect({ onSelect, value }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'audience',
    value,
    onChange: onSelect,
  });

  const group = getRootProps();

  return (
    <VStack align='start'>
      <Text fontSize='xl' fontWeight='bold'>
        You are?
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
