import { Box, Stack, Container, Stat, Grid, GridItem, Center, Heading, Text } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";

export default function About() {
  return (
    <Box display={"flex"} flexDirection={"column"} minH={"100dvh"}>
      <Navbar />

      <Box bg={"gray.50"} flex={"1"} data-testid="about-page">
        <Container maxW={"5xl"} py={{ base: 10, md: 20 }}>
          <Center>
            <Box textAlign={"center"} maxW={"2xl"} mb={{ base: 12, md: 16 }}>
              <Text color={"green.600"} fontWeight={"semibold"} letterSpacing={"wide"} textTransform={"uppercase"} fontSize={"sm"} mb={2}>About us</Text>
              <Heading as={"h1"} size={{ base: "2xl", md: "3xl" }} mb={4}>A hospital built around the patient.</Heading>
              <Text fontSize={"lg"} color={"gray.600"}>Since 1978, Danish Hospital has grown from a small community clinic into a regional teaching hospital — but our commitment to compassionate, individualized care has never changed.</Text>
            </Box>
          </Center>

          <Box mb={{ base: 12, md: 16 }}>
            <Stack bg={"white"} shadow={"md"} padding={{ base: 4, md: 6 }} borderRadius={"2xl"} direction={{ base: "column", sm: "row" }}>
              <Box flex={1} display="grid" placeItems="center" padding={4}>
                <Stat.Root textAlign={"center"}>
                  <Stat.ValueText fontSize={"3xl"} fontWeight={"bold"} color={"blue.600"} justifyContent={"center"}>600+</Stat.ValueText>
                  <Stat.Label color={"gray.600"}>Inpatient beds</Stat.Label>
                </Stat.Root>
              </Box>
              <Box flex={1} display="grid" placeItems="center" padding={4}>
                <Stat.Root textAlign={"center"}>
                  <Stat.ValueText fontSize={"3xl"} fontWeight={"bold"} color={"blue.600"} justifyContent={"center"}>1.2M</Stat.ValueText>
                  <Stat.Label color={"gray.600"}>Patients served yearly</Stat.Label>
                </Stat.Root>
              </Box>
              <Box flex={1} display="grid" placeItems="center" padding={4}>
                <Stat.Root textAlign={"center"}>
                  <Stat.ValueText fontSize={"3xl"} fontWeight={"bold"} color={"blue.600"} justifyContent={"center"}>45</Stat.ValueText>
                  <Stat.Label color={"gray.600"}>Years of care</Stat.Label>
                </Stat.Root>
              </Box>
              <Box flex={1} display="grid" placeItems="center" padding={4}>
                <Stat.Root textAlign={"center"}>
                  <Stat.ValueText fontSize={"3xl"} fontWeight={"bold"} color={"blue.600"} justifyContent={"center"}>30</Stat.ValueText>
                  <Stat.Label color={"gray.600"}>Specialty departments</Stat.Label>
                </Stat.Root>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Heading as={"h2"} size={"xl"} textAlign={"center"} mb={8}>Our values</Heading>
            <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={5}>
              <GridItem bg={"white"} shadow={"sm"} borderRadius={"xl"} p={6}>
                <Text fontWeight={"semibold"} mb={1}>Clinical excellence</Text>
                <Text color={"gray.600"} fontSize={"sm"}>Board-certified physicians and evidence-based protocols.</Text>
              </GridItem>
              <GridItem bg={"white"} shadow={"sm"} borderRadius={"xl"} p={6}>
                <Text fontWeight={"semibold"} mb={1}>Clinical excellence</Text>
                <Text color={"gray.600"} fontSize={"sm"}>Board-certified physicians and evidence-based protocols.</Text>
              </GridItem>
              <GridItem bg={"white"} shadow={"sm"} borderRadius={"xl"} p={6}>
                <Text fontWeight={"semibold"} mb={1}>Clinical excellence</Text>
                <Text color={"gray.600"} fontSize={"sm"}>Board-certified physicians and evidence-based protocols.</Text>
              </GridItem>
              <GridItem bg={"white"} shadow={"sm"} borderRadius={"xl"} p={6}>
                <Text fontWeight={"semibold"} mb={1}>Clinical excellence</Text>
                <Text color={"gray.600"} fontSize={"sm"}>Board-certified physicians and evidence-based protocols.</Text>
              </GridItem>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
