import { Box, Container, Text } from "@chakra-ui/react";
import LoginCompoent from "../../components/LoginCompoent";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { Link } from "react-router";

export default function Login() {
  return (
    <Box display={"flex"} flexDirection={"column"} h={"100dvh"} overflow={"hidden"}>
      <Navbar />

      <Box bg={"gray.50"} flex={"1"} minH={0} data-testid="login-page">
        <Container maxW={"6xl"} h={"full"} display={"flex"} flexDirection={"column"} justifyContent={"center"} py={4}>
          <LoginCompoent />

          <Text textAlign={"center"} fontSize={"sm"} color={"gray.600"} mt={3}>
            Already have a session?{" "}
            <Link data-testid="login-dashboard-link" to="/app">
              <Text as={"span"} color={"green.600"} fontWeight={"semibold"}>
                Go to dashboard
              </Text>
            </Link>
          </Text>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
