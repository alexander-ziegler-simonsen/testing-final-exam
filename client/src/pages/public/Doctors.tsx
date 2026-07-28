import { Container } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";

export default function Doctors() {
  return (
    <>
        <Navbar />

      <Container className="bodyWrapper">
        <p>this is doctors page</p>
      </Container>
    </>
  );
}
