import { Avatar, Badge, Box, Button, Container, Grid, Heading, HStack, Icon, Input, InputGroup, Text } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { Search, Star } from "lucide-react";

type Doctor = {
  name: string;
  specialty: string;
  department: string;
  rating: number;
  years: number;
  image: string;
};

const doctors: Doctor[] = [
  { name: "Dr. Elena Marsh", specialty: "Cardiology", department: "Heart & Vascular Center", rating: 4.9, years: 14, image: "https://www.loremfaces.net/256/id/1.jpg" },
  { name: "Dr. Priya Nandan", specialty: "Pediatrics", department: "Children's Hospital", rating: 5.0, years: 9, image: "https://www.loremfaces.net/256/id/3.jpg" },
  { name: "Dr. James Whitfield", specialty: "Orthopedics", department: "Bone & Joint Center", rating: 4.7, years: 18, image: "https://www.loremfaces.net/256/id/4.jpg" },
  { name: "Dr. Sofia Bianchi", specialty: "Dermatology", department: "Skin Health Clinic", rating: 4.9, years: 7, image: "https://www.loremfaces.net/256/id/5.jpg" },
];

export default function Doctors() {
  return (
    <Box display={"flex"} flexDirection={"column"} minH={"100dvh"}>
      <Navbar />

      <Box bg={"gray.50"} flex={"1"} data-testid="doctors-page">
        <Container maxW={"6xl"} py={{ base: 10, md: 20 }}>
          <Box textAlign={"center"} maxW={"2xl"} mx={"auto"} mb={{ base: 10, md: 14 }}>
            <Text color={"green.600"} fontWeight={"semibold"} letterSpacing={"wide"} textTransform={"uppercase"} fontSize={"sm"} mb={2}>
              Our team
            </Text>
            <Heading as={"h1"} size={{ base: "2xl", md: "3xl" }} mb={4}>
              Meet our specialists.
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Board-certified physicians across 30 departments, dedicated to giving you the care you deserve.
            </Text>
          </Box>

          {/* <HStack justify={"center"} mb={{ base: 10, md: 14 }}>
            <InputGroup startElement={<Icon color={"gray.400"}><Search size={18} /></Icon>} maxW={"md"} w={"full"}>
              <Input data-testid="doctors-search-input" bg={"white"} placeholder="Search by name or specialty" borderRadius={"full"} />
            </InputGroup>
          </HStack> */}

          <Grid templateColumns={{ base: "1fr", sm: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={6}>
            {doctors.map((doctor) => {
              const testIdSlug = doctor.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <Box
                  key={doctor.name}
                  bg={"white"}
                  borderRadius={"2xl"}
                  shadow={"sm"}
                  p={6}
                  textAlign={"center"}
                  data-testid={`doctors-card-${testIdSlug}`}
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                  transition={"all 0.15s ease"}
                >
                  <Avatar.Root size={"2xl"} mx={"auto"} mb={4}>
                    <Avatar.Image src={doctor.image} />
                    <Avatar.Fallback name={doctor.name} />
                  </Avatar.Root>

                  <Heading as={"h3"} size={"md"} mb={1} data-testid={`doctors-card-${testIdSlug}-name`}>
                    {doctor.name}
                  </Heading>
                  <Text color={"blue.600"} fontWeight={"medium"} fontSize={"sm"} mb={1} data-testid={`doctors-card-${testIdSlug}-specialty`}>
                    {doctor.specialty}
                  </Text>
                  <Text color={"gray.500"} fontSize={"sm"} mb={4} data-testid={`doctors-card-${testIdSlug}-department`}>
                    {doctor.department}
                  </Text>

                  <HStack justify={"center"} gap={4} mb={5}>
                    <HStack gap={1}>
                      <Icon color={"#f5b400"}><Star size={16} fill="#f5b400" /></Icon>
                      <Text fontSize={"sm"} fontWeight={"semibold"} data-testid={`doctors-card-${testIdSlug}-rating`}>{doctor.rating.toFixed(1)}</Text>
                    </HStack>
                    <Badge colorPalette={"green"} variant={"subtle"} borderRadius={"full"} px={3} data-testid={`doctors-card-${testIdSlug}-years`}>
                      {doctor.years} yrs experience
                    </Badge>
                  </HStack>

                  <Button size={"sm"} width={"full"} colorPalette={"green"} bg={"green.600"} color={"white"} _hover={{ bg: "green.700" }} data-testid={`doctors-card-${testIdSlug}-book-button`}>
                    Book appointment
                  </Button>
                </Box>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
