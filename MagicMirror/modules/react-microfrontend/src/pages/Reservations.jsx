import Layout from "../components/Layout";
import ReservationList from "../components/ReservationList";


const reservations = [
  {
    activity: 'OPEN_LAB',
    task: 'FABRICATION_3D',
    ageClass: 'ADULT',
    date: '2025-07-30',
    startTime: '10:00',
    duration: 'PT1H',
    status: 'COMPLETED',
  },
  {
    activity: 'WORKSHOP',
    task: 'ELECTRONICS',
    ageClass: 'CHILD',
    date: '2025-08-01',
    startTime: '14:00',
    duration: 'PT2H',
    status: 'NOT_COMPLETED',
  },
    {
    activity: 'OPEN_LAB',
    task: 'FABRICATION_3D',
    ageClass: 'ADULT',
    date: '2025-07-30',
    startTime: '10:00',
    duration: 'PT1H',
    status: 'COMPLETED',
  },
  {
    activity: 'WORKSHOP',
    task: 'ELECTRONICS',
    ageClass: 'CHILD',
    date: '2025-08-01',
    startTime: '14:00',
    duration: 'PT2H',
    status: 'NOT_COMPLETED',
  },
    {
    activity: 'OPEN_LAB',
    task: 'FABRICATION_3D',
    ageClass: 'ADULT',
    date: '2025-07-30',
    startTime: '10:00',
    duration: 'PT1H',
    status: 'COMPLETED',
  },
  {
    activity: 'WORKSHOP',
    task: 'ELECTRONICS',
    ageClass: 'CHILD',
    date: '2025-08-01',
    startTime: '14:00',
    duration: 'PT2H',
    status: 'NOT_COMPLETED',
  },
    {
    activity: 'OPEN_LAB',
    task: 'FABRICATION_3D',
    ageClass: 'ADULT',
    date: '2025-07-30',
    startTime: '10:00',
    duration: 'PT1H',
    status: 'COMPLETED',
  },
  {
    activity: 'WORKSHOP',
    task: 'ELECTRONICS',
    ageClass: 'CHILD',
    date: '2025-08-01',
    startTime: '14:00',
    duration: 'PT2H',
    status: 'NOT_COMPLETED',
  },
    {
    activity: 'OPEN_LAB',
    task: 'FABRICATION_3D',
    ageClass: 'ADULT',
    date: '2025-07-30',
    startTime: '10:00',
    duration: 'PT1H',
    status: 'COMPLETED',
  },
  {
    activity: 'WORKSHOP',
    task: 'ELECTRONICS',
    ageClass: 'CHILD',
    date: '2025-08-01',
    startTime: '14:00',
    duration: 'PT2H',
    status: 'NOT_COMPLETED',
  },
];

const Reservations = () => {
    return (
        <Layout>
            <ReservationList reservations={reservations} />
        </Layout>
    )
}

export default Reservations;