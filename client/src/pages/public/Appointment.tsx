import { Badge, Box, Button, Container, Grid, Heading, HStack, Icon, Input, NativeSelect, Stack, Text, Textarea } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { CalendarCheck, MessageSquare, ShieldCheck } from "lucide-react";

const departments = [
  "Cardiology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "General checkup",
];

const steps = [
  {
    icon: CalendarCheck,
    title: "Pick a time",
    description: "Choose your department and a date and time that works for you.",
  },
  {
    icon: MessageSquare,
    title: "We confirm",
    description: "Our staff reviews your request and confirms by phone or email within one business day.",
  },
  {
    icon: ShieldCheck,
    title: "You're seen",
    description: "Show up a few minutes early with your ID and insurance card, and you're all set.",
  },
];

export default function Appointment() {
  return (
    <Box display={"flex"} flexDirection={"column"} minH={"100dvh"}>
      <Navbar />

      <Box bg={"gray.50"} flex={"1"} data-testid="appointment-page">
        <Container maxW={"6xl"} py={{ base: 10, md: 20 }}>
          <Box textAlign={"center"} maxW={"2xl"} mx={"auto"} mb={{ base: 10, md: 14 }}>
            <Text color={"green.600"} fontWeight={"semibold"} letterSpacing={"wide"} textTransform={"uppercase"} fontSize={"sm"} mb={2}>
              Book a visit
            </Text>
            <Heading as={"h1"} size={{ base: "2xl", md: "3xl" }} mb={4}>
              Let's get you booked in.
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Fill out the form below and our care team will confirm your appointment shortly. For emergencies, please call 112.
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8}>
            <Box bg={"white"} borderRadius={"2xl"} shadow={"sm"} p={{ base: 6, md: 8 }} data-testid="appointment-form">
              <Heading as={"h2"} size={"md"} mb={6}>
                Appointment details
              </Heading>
              <Stack gap={4}>
                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                  <Input data-testid="appointment-name-input" placeholder="Full name" bg={"gray.50"} />
                  <Input data-testid="appointment-phone-input" type="tel" placeholder="Phone number" bg={"gray.50"} />
                </Grid>
                <Input data-testid="appointment-email-input" type="email" placeholder="Email address" bg={"gray.50"} />

                <NativeSelect.Root size={"md"} bg={"gray.50"} borderRadius={"md"}>
                  <NativeSelect.Field data-testid="appointment-department-select" defaultValue="">
                    <option value="" disabled>
                      Select a department
                    </option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                  <Input data-testid="appointment-date-input" type="date" bg={"gray.50"} />
                  <Input data-testid="appointment-time-input" type="time" bg={"gray.50"} />
                </Grid>

                <Textarea data-testid="appointment-reason-input" placeholder="Briefly describe the reason for your visit" bg={"gray.50"} minH={"120px"} />

                <Button data-testid="appointment-submit-button" alignSelf={"flex-start"} colorPalette={"green"} bg={"green.600"} color={"white"} _hover={{ bg: "green.700" }} size={"lg"}>
                  Request appointment
                </Button>
              </Stack>
            </Box>

            <Stack gap={4}>
              {steps.map((step, index) => (
                <HStack
                  key={step.title}
                  bg={"white"}
                  borderRadius={"2xl"}
                  shadow={"sm"}
                  p={5}
                  gap={4}
                  align={"flex-start"}
                  data-testid={`appointment-step-${index + 1}`}
                >
                  <Box bg={"green.50"} p={3} borderRadius={"xl"}>
                    <Icon color={"#26ab57"}>
                      <step.icon size={20} />
                    </Icon>
                  </Box>
                  <Box>
                    <HStack mb={1}>
                      <Text fontWeight={"semibold"}>{step.title}</Text>
                      <Badge colorPalette={"gray"} variant={"subtle"} borderRadius={"full"}>
                        Step {index + 1}
                      </Badge>
                    </HStack>
                    <Text color={"gray.600"} fontSize={"sm"}>
                      {step.description}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </Stack>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
