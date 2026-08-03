import { Container } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";

export default function Contact() {
  return (
    <>
        <Navbar />

      <Container data-testid="contact-page">
        <p>this is contact page</p>
      </Container>
    </>
  );
}
