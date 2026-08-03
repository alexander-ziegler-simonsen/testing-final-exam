import { Container } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";

export default function Appointment() {
  return (
    <>
        <Navbar />

      <Container data-testid="appointment-page">
        <p>this is appointment page</p>
      </Container>
    </>
  );
}
