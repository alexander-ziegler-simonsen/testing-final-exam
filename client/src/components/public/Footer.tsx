import { Box, Container, Grid, GridItem, HStack, Icon, Separator, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <Box
            w={"full"}
            bg={"gray.800"}
            color={"gray.300"}
            mt={"auto"}
            data-testid="public-footer"
        >
            <Container maxW={"7xl"} py={{ base: 10, md: 14 }}>
                <Grid
                    templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                    gap={{ base: 8, md: 10 }}
                >
                    <GridItem data-testid="public-footer-part-1">
                        <Text color={"white"} fontSize={"xl"} fontWeight={"bold"} mb={3}>
                            Danish Hospital
                        </Text>
                        <Text fontSize={"sm"} color={"gray.400"}>
                            Compassionate care and modern medicine, bringing together world-class specialists under one roof since 1978.
                        </Text>
                    </GridItem>

                    <GridItem data-testid="public-footer-part-2">
                        <Text color={"white"} fontWeight={"semibold"} mb={3}>
                            Quick links
                        </Text>
                        <Stack gap={2} fontSize={"sm"}>
                            <Link data-testid="public-footer-home-link" to="/">Home</Link>
                            <Link data-testid="public-footer-about-link" to="/about">About</Link>
                            <Link data-testid="public-footer-doctors-link" to="/doctors">Doctors</Link>
                            <Link data-testid="public-footer-contact-link" to="/Contact">Contact</Link>
                            <Link data-testid="public-footer-login-link" to="/login">Login</Link>
                        </Stack>
                    </GridItem>

                    <GridItem data-testid="public-footer-part-3">
                        <Text color={"white"} fontWeight={"semibold"} mb={3}>
                            Departments
                        </Text>
                        <Stack gap={2} fontSize={"sm"} color={"gray.400"}>
                            <Text>Cardiology</Text>
                            <Text>Pediatrics</Text>
                            <Text>Emergency care</Text>
                            <Text>Oncology</Text>
                        </Stack>
                    </GridItem>

                    <GridItem data-testid="public-footer-part-4">
                        <Text color={"white"} fontWeight={"semibold"} mb={3}>
                            Contact
                        </Text>
                        <Stack gap={2} fontSize={"sm"} color={"gray.400"}>
                            <HStack align={"flex-start"} gap={2}>
                                <Icon color={"#26ab57"} mt={"2px"}><MapPin size={16} /></Icon>
                                <Text>Hospitalsvej 12, 2100 København Ø, Denmark</Text>
                            </HStack>
                            <HStack gap={2}>
                                <Icon color={"#26ab57"}><Phone size={16} /></Icon>
                                <Text>+45 33 12 45 67</Text>
                            </HStack>
                            <HStack gap={2}>
                                <Icon color={"#26ab57"}><Mail size={16} /></Icon>
                                <Text>contact@fakemeridianhealth.dk</Text>
                            </HStack>
                        </Stack>
                    </GridItem>
                </Grid>

                <Separator my={8} borderColor={"gray.700"} />

                <Text fontSize={"xs"} color={"gray.500"} textAlign={"center"}>
                    © {new Date().getFullYear()} Danish Hospital. All rights reserved.
                </Text>
            </Container>
        </Box>
    );
}
