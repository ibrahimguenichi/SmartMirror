import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ReservationList from "../components/ReservationList";
import { getMyReservations } from "../api/reservation";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await getMyReservations();
        if (reservations) {
          console.log("Fetched Reservations:", reservations);
          setReservations(reservations);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <Layout>
      <ReservationList
        reservations={reservations}
        setReservations={setReservations}
      />
    </Layout>
  );
};

export default Reservations;
