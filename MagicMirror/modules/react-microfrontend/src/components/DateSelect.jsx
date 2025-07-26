import dayjs from 'dayjs';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Text } from '@chakra-ui/react';

export default function DateSelect({ value, onChange }) {
  const now = dayjs();
  const selectedDate = value ? dayjs(value).toDate() : null;

  const minDate = now.toDate();
  const maxDate = new Date(2025, 11, 31);

  return (
    <div className='flex flex-col items-start gap-3'>
      <Text fontSize='xl' fontWeight='bold'>
        Choose the date
      </Text>
      <div className='rounded-xl border border-orange-500 p-2 shadow-md bg-white'>
        <ReactDatePicker
          inline
          selected={selectedDate}
          onChange={onChange}
          openToDate={now.toDate()}
          minDate={minDate}
          maxDate={maxDate}
          showMonthDropdown={false}
          showYearDropdown={false}
          calendarClassName='tailwind-datepicker'
          dayClassName={(date) =>
            dayjs(date).isSame(dayjs(), 'day')
              ? 'bg-orange-500 text-white rounded-full'
              : 'hover:bg-orange-100 rounded-full transition'
          }
        />
      </div>
    </div>
  );
}
