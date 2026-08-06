import { Box, Container, Grid, Heading, HStack, Icon, Separator, Stack, Text } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    lines: ["Hospitalsvej 12", "2100 København Ø, Denmark"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+45 33 12 45 67", "Emergency: +45 70 20 15 90"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["contact@fakemeridianhealth.dk", "billing@fakemeridianhealth.dk"],
  },
  {
    icon: Clock,
    label: "Opening hours",
    lines: ["Mon–Fri: 08:00 – 18:00", "Emergency room: 24/7"],
  },
];

const departmentContacts = [
  { department: "Cardiology", phone: "+45 33 12 45 68", email: "cardiology@fakemeridianhealth.dk" },
  { department: "Pediatrics", phone: "+45 33 12 45 69", email: "pediatrics@fakemeridianhealth.dk" },
  { department: "Orthopedics", phone: "+45 33 12 45 70", email: "orthopedics@fakemeridianhealth.dk" },
  { department: "Oncology", phone: "+45 33 12 45 71", email: "oncology@fakemeridianhealth.dk" },
  { department: "Dermatology", phone: "+45 33 12 45 72", email: "dermatology@fakemeridianhealth.dk" },
];

export default function Contact() {
  return (
    <Box display={"flex"} flexDirection={"column"} minH={"100dvh"}>
      <Navbar />

      <Box bg={"gray.50"} flex={"1"} data-testid="contact-page">
        <Container maxW={"6xl"} py={{ base: 10, md: 20 }}>
          <Box textAlign={"center"} maxW={"2xl"} mx={"auto"} mb={{ base: 12, md: 16 }}>
            <Text color={"green.600"} fontWeight={"semibold"} letterSpacing={"wide"} textTransform={"uppercase"} fontSize={"sm"} mb={2}>
              Contact us
            </Text>
            <Heading as={"h1"} size={{ base: "2xl", md: "3xl" }} mb={4}>
              We'd love to hear from you.
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Reach out directly using the details below, or find the right department for your question.
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={5} mb={{ base: 12, md: 16 }}>
            {contactDetails.map((detail) => (
              <Box
                key={detail.label}
                bg={"white"}
                borderRadius={"2xl"}
                shadow={"sm"}
                p={6}
                textAlign={"center"}
                data-testid={`contact-detail-${detail.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Box bg={"green.50"} p={3} borderRadius={"xl"} display={"inline-flex"} mb={3}>
                  <Icon color={"#26ab57"}>
                    <detail.icon size={22} />
                  </Icon>
                </Box>
                <Text fontWeight={"semibold"} mb={1}>
                  {detail.label}
                </Text>
                {detail.lines.map((line) => (
                  <Text key={line} color={"gray.600"} fontSize={"sm"}>
                    {line}
                  </Text>
                ))}
              </Box>
            ))}
          </Grid>

          <Box bg={"white"} borderRadius={"2xl"} shadow={"sm"} p={{ base: 6, md: 8 }} data-testid="contact-department-directory">
            <Heading as={"h2"} size={"lg"} mb={6}>
              Reach a specific department
            </Heading>

            {/* Table layout for medium screens and up */}
            <Box display={{ base: "none", md: "block" }}>
              <Grid
                templateColumns={"1fr 1fr 1.6fr"}
                px={2}
                pb={3}
                color={"gray.500"}
                fontSize={"xs"}
                fontWeight={"semibold"}
                textTransform={"uppercase"}
                letterSpacing={"wide"}
              >
                <Text>Department</Text>
                <Text>Phone</Text>
                <Text>Email</Text>
              </Grid>

              <Stack gap={0}>
                {departmentContacts.map((dept, index) => (
                  <Box key={dept.department}>
                    <Grid
                      templateColumns={"1fr 1fr 1.6fr"}
                      alignItems={"center"}
                      py={4}
                      px={2}
                      gap={2}
                      data-testid={`contact-department-${dept.department.toLowerCase()}`}
                    >
                      <Text fontWeight={"semibold"}>{dept.department}</Text>
                      <HStack gap={2} color={"gray.600"} fontSize={"sm"}>
                        <Icon color={"#26ab57"}><Phone size={16} /></Icon>
                        <Text>{dept.phone}</Text>
                      </HStack>
                      <HStack gap={2} color={"gray.600"} fontSize={"sm"}>
                        <Icon color={"#26ab57"}><Mail size={16} /></Icon>
                        <Text>{dept.email}</Text>
                      </HStack>
                    </Grid>
                    {index < departmentContacts.length - 1 && <Separator borderColor={"gray.200"} />}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Stacked cards for small screens */}
            <Stack display={{ base: "flex", md: "none" }} gap={4}>
              {departmentContacts.map((dept) => (
                <Box
                  key={dept.department}
                  borderWidth={1}
                  borderColor={"gray.200"}
                  borderRadius={"xl"}
                  p={4}
                  data-testid={`contact-department-${dept.department.toLowerCase()}`}
                >
                  <Text fontWeight={"semibold"} mb={2}>{dept.department}</Text>
                  <Stack gap={1}>
                    <HStack gap={2} color={"gray.600"} fontSize={"sm"}>
                      <Icon color={"#26ab57"}><Phone size={16} /></Icon>
                      <Text>{dept.phone}</Text>
                    </HStack>
                    <HStack gap={2} color={"gray.600"} fontSize={"sm"}>
                      <Icon color={"#26ab57"}><Mail size={16} /></Icon>
                      <Text>{dept.email}</Text>
                    </HStack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
