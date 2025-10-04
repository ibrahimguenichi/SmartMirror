import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import ReservationList from "../components/ReservationList";
import axios from "axios";
import { Spinner, Center, Text } from "@chakra-ui/react";
import { AppContext } from '../context/AppContext';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { backendURL } = useContext(AppContext);
useEffect(() => {
  axios
    .get(`${backendURL}/reservation/my`, {  // ← endpoint pour les réservations du user connecté
      withCredentials: true,
    })
    .then((res) => {
      const mappedReservations = res.data.map((r) => ({
        ...r,
        ageClass: r.ageGroup,
        status: r.status || "NOT_COMPLETED",
      }));
      setReservations(mappedReservations);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err.response);
      setError(
        `Erreur ${err.response?.status || ""}: ${
          err.response?.data?.message || err.message
        }`
      );
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <Layout>
        <Center minH="50vh">
          <Spinner size="xl" />
        </Center>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Center minH="50vh">
          <Text color="red.500">{error}</Text>
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <ReservationList reservations={reservations} />
    </Layout>
  );
};

export default Reservations;
