import { Box, Heading, Text, Stack, Container, AbsoluteCenter } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container>
        <p>this is home page</p>
      </Container>
    </>
  );
}
