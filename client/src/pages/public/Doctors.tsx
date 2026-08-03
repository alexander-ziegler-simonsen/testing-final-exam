import { Container } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";

export default function Doctors() {
  return (
    <>
        <Navbar />

      <Container className="bodyWrapper" data-testid="doctors-page">
        <p>this is doctors page</p>
      </Container>
    </>
  );
}
