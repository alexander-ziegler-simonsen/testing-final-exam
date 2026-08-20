import { Text, Container, Button, HStack, Card, Box, Stack, Image, Heading, Icon } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { Clock, Stethoscope, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <Box display={"flex"} flexDirection={"column"} minH={"100dvh"}>
      <Navbar />

      <Box bg={"gray.50"} flex={"1"} data-testid="home-page">
        <Container maxW={"7xl"} py={{ base: 10, md: 20 }}>
          <Stack gap={{ base: 10, md: 16 }} direction={{ base: "column", md: "row" }} align={"center"}>
            <Box flex={1}>
              <Heading as={"h1"} size={{ base: "2xl", md: "4xl" }} lineHeight={1.15} mb={5}>Compassionate care, modern medicine.</Heading>
              <Text fontSize={"lg"} color={"gray.600"} mb={8} maxW={"xl"}>Danish Hospital brings together world-class specialists, advanced diagnostics, and a warm patient experience — all under one roof.</Text>

              <HStack gap={4} mb={10} flexWrap={"wrap"}>
                <Button data-testid="home-explore-services-button" size={"lg"} variant={"outline"}>Explore services</Button>
              </HStack>

              <Stack direction={{ base: "column", sm: "row" }} gap={6}>
                <Card.Root bg={"white"} shadow={"sm"} borderRadius={"xl"} flex={1} data-testid="home-feature-emergency">
                  <Card.Body p={5}>
                    <Icon color={"#26ab57"} mb={2}><Clock size={28} /></Icon>
                    <Card.Title fontSize={"md"}>24/7 Emergency</Card.Title>
                    <Card.Description fontSize={"sm"}>Level-1 trauma center staffed around the clock.</Card.Description>
                  </Card.Body>
                </Card.Root>

                <Card.Root bg={"white"} shadow={"sm"} borderRadius={"xl"} flex={1} data-testid="home-feature-specialists">
                  <Card.Body p={5}>
                    <Icon color={"#26ab57"} mb={2}><Stethoscope size={28} /></Icon>
                    <Card.Title fontSize={"md"}>120+ Specialists</Card.Title>
                    <Card.Description fontSize={"sm"}>Board-certified doctors across 30 departments.</Card.Description>
                  </Card.Body>
                </Card.Root>

                <Card.Root bg={"white"} shadow={"sm"} borderRadius={"xl"} flex={1} data-testid="home-feature-accredited">
                  <Card.Body p={5}>
                    <Icon color={"#26ab57"} mb={2}><ShieldCheck size={28} /></Icon>
                    <Card.Title fontSize={"md"}>Accredited care</Card.Title>
                    <Card.Description fontSize={"sm"}>JCI-accredited with a 4.9 patient satisfaction score.</Card.Description>
                  </Card.Body>
                </Card.Root>
              </Stack>
            </Box>

            <Box flex={1}>
              <Image data-testid="home-hero-image" src="https://cdn.pixabay.com/photo/2016/05/01/21/29/universitatsklinikum-ulm-1366018_1280.jpg" borderRadius={"2xl"} shadow={"lg"} objectFit={"cover"} w={"full"}h={{ base: "260px", md: "420px" }} />
            </Box>
          </Stack>

          <Box textAlign={"center"} mt={{ base: 16, md: 24 }} mb={10}>
            <Heading as={"h2"} size={"xl"}>Featured departments</Heading>
          </Box>

          <Box borderRadius={"2xl"} bgGradient={"to-r"} gradientFrom={"blue.500"} gradientTo={"blue.700"} color={"white"} px={{ base: 6, md: 12 }} py={{ base: 8, md: 12 }}>
            <Stack gap={10} direction={{ base: "column", md: "row" }} justify={"space-between"}>
              <Box flex={1}>
                <Heading as={"h3"} size={"lg"} mb={3}>Need care today?</Heading>
                <Text color={"blue.50"}>Same-day appointments available for urgent, non-emergency needs. Our nurse line is open 24/7 for guidance.</Text>
              </Box>

              <Box flex={1}>
                <Heading as={"h3"} size={"lg"} mb={3}>Need care today?</Heading>
                <Text color={"blue.50"}>Same-day appointments available for urgent, non-emergency needs. Our nurse line is open 24/7 for guidance.</Text>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
