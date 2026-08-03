import { Text, Container, Button, HStack, Card, Box, Stack, Image } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { Clock, Stethoscope, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      <Container bg={"red.300"} marginLeft={"auto"} marginRight={"auto"} width={"auto"} data-testid="home-page">

        <Stack gap={12} direction={{
          base: "column",
          sm: "row"
        }}>
          <Box boxSize={"6/12"} padding={6}>
            <Text textStyle={"3xl"}>
            Compassionate care, modern medicine.
          </Text>
          <Text>
            Meridian Health brings together world-class specialists, advanced diagnostics, and a warm patient experience — all under one roof.
          </Text>

          <Button data-testid="home-book-appointment-button" margin={3} bg={"green.600"} variant={"surface"}>
            book an appointment
          </Button>
          <Button data-testid="home-explore-services-button" margin={3} variant={"outline"}>
            explore services
          </Button>

          <HStack alignItems={"center"} justifyContent={"center"} width={"auto"}>
            <Card.Root bg={"transparent"} borderColor={"transparent"} data-testid="home-feature-emergency">
              <Card.Body p={2} >
                <Clock color="#26ab57" />
                <Card.Title>24/7 Emergency</Card.Title>
                <Card.Description>
                  Level-1 trauma center staffed around the clock.
                </Card.Description>
              </Card.Body>
            </Card.Root>

            <Card.Root bg={"transparent"} borderColor={"transparent"} data-testid="home-feature-specialists">
              <Card.Body p={2} >
                <Stethoscope color="#26ab57" />
                <Card.Title>120+ Specialists</Card.Title>
                <Card.Description>
                  Board-certified doctors across 30 departments.
                </Card.Description>
              </Card.Body>
            </Card.Root>

            <Card.Root bg={"transparent"} borderColor={"transparent"} data-testid="home-feature-accredited">
              <Card.Body p={2} >
                <ShieldCheck color="#26ab57" />
                <Card.Title>Accredited care</Card.Title>
                <Card.Description>
                  JCI-accredited with a 4.9 patient satisfaction score.
                </Card.Description>
              </Card.Body>
            </Card.Root>


          </HStack>
          </Box>

          <Box boxSize={"6/12"} padding={6}>

            <Image data-testid="home-hero-image" src="https://cdn.pixabay.com/photo/2016/05/01/21/29/universitatsklinikum-ulm-1366018_1280.jpg" borderRadius={58} />
          </Box>
        </Stack>


        <Container width={"auto"}>
          <h1>Featured departments</h1>
        </Container>


        <Container borderRadius={8} bgColor={"blue.300"} width={"auto"} padding={6}>
          <Stack gap={12} justify={"space-between"} direction={{
            base: "column",
            sm: "row"
          }}>
            <Box boxSize={"30"}>
              <h1>Need care today?</h1>
              <p>Same-day appointments available for urgent, non-emergency needs. Our nurse line is open 24/7 for guidance.</p>
            </Box>

            <Box boxSize={"30"}>
              <h1>Need care today?</h1>
              <p>Same-day appointments available for urgent, non-emergency needs. Our nurse line is open 24/7 for guidance.</p>
            </Box>
          </Stack>
        </Container>


      </Container>

      <Footer />
    </>
  );
}
