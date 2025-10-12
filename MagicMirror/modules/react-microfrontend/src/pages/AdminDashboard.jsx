import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Spinner,
  Center,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {getAllUsers} from "../api/user";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <Container maxW="container.xl">
        <Box mb={8}>
          <Heading size="lg" mb={2}>
            Admin Dashboard
          </Heading>
          <Text color="gray.600">
            Manage users and system settings
          </Text>
        </Box>

        <Card bg={bg} border="1px solid" borderColor={border}>
          <CardBody>
            <Heading size="md" mb={4}>
              Users Management
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.firstName} {user.lastName}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge 
                          colorScheme={user.role === 'ADMIN' ? 'red' : 'blue'}
                        >
                          {user.userRole}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="green">
                          Active
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
