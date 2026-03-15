import { Box, Heading, Text } from "@chakra-ui/react"
import Navbar from "../components/Navbar"

export default function About() {
    return (
        <>
            <Navbar />

            <Box p={8}>
                <Heading mb={4}>Welcome to the Hospital System</Heading>

                <Text>
                    we here at 'Hospital System', like to handle patients with care.
                </Text>
            </Box>
        </>
    )
}