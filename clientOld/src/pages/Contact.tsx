import { Box, Heading, Text, Stack } from "@chakra-ui/react"

export default function Contact() {
    return (
        <>
            <Box p={8} maxW="800px">
                <Heading mb={4}>Contact Us</Heading>

                <Text mb={6}>
                    Have a question, feedback, or need to reach a specific department? We're here to help. Don't hesitate to get in touch with us using the details below.
                </Text>

                <Heading size="md" mb={3}>General Inquiries</Heading>
                <Stack mb={6}>
                    <Text>Email: info@fake-not-real-hospital.dk</Text>
                    <Text>Phone: +45 12 34 56 78</Text>
                    <Text>Hours: Monday – Friday, 08:00 – 16:00</Text>
                </Stack>

                <Heading size="md" mb={3}>Emergency</Heading>
                <Stack mb={6}>
                    <Text>Emergency Line: +01 12 34 56 78</Text>
                    <Text>Available 24/7 — for life-threatening situations only.</Text>
                </Stack>

                <Heading size="md" mb={3}>Visit Us</Heading>
                <Stack mb={6}>
                    <Text>Fake General Hospital</Text>
                    <Text>Hospitalsvej 9999</Text>
                    <Text>2100 Copenhagen Ø, Denmark</Text>
                </Stack>

                <Heading size="md" mb={3}>Patient Relations</Heading>
                <Stack>
                    <Text>Email: book@fake-not-real-hospital.dk</Text>
                    <Text>Phone: +45 12 34 56 78</Text>
                    <Text>For complaints, feedback, or non-urgent patient matters.</Text>
                </Stack>
            </Box>
        </>
    )
}