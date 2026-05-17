import { Box, Heading, Text, Stack } from "@chakra-ui/react"

export default function About() {
    return (
        <>
            <Box p={8} maxW="800px">
                <Heading mb={4}>Welcome to Fake General Hospital</Heading>

                <Text mb={4}>
                    Fake General Hospital has been serving the community since 1978. Located in the heart of Copenhagen, we are committed to providing world-class medical care to every patient who walks through our doors — regardless of background or circumstance. 
                </Text>

                <Box borderBottom="1px solid" borderColor="gray.200" my={6} />

                <Heading size="md" mb={3}>Our Mission</Heading>
                <Text mb={4}>
                    Our mission is to deliver compassionate, evidence-based healthcare with a focus on patient dignity, safety, and long-term wellbeing. We believe that excellent medical care goes hand in hand with empathy and respect.
                </Text>

                <Heading size="md" mb={3}>Departments</Heading>
                <Stack mb={4} pl={4}>
                    <Text>• Emergency & Trauma Care</Text>
                    <Text>• Cardiology & Cardiovascular Surgery</Text>
                    <Text>• Oncology & Cancer Research</Text>
                    <Text>• Pediatrics & Neonatal Care</Text>
                    <Text>• Orthopedics & Rehabilitation</Text>
                    <Text>• Neurology & Neurosurgery</Text>
                </Stack>

                <Heading size="md" mb={3}>Contact</Heading>
                <Text>Address: Hospitalsvej 9999, 2100 Copenhagen Ø, Denmark</Text>
                <Text>Phone: +45 12 34 56 78</Text>
                <Text>Email: info@fake-not-real-hospital.dk</Text>
                <Text mt={2} color="gray.500" fontSize="sm">Open 24/7 — Emergency line available at all hours.</Text>
            </Box>
        </>
    )
}