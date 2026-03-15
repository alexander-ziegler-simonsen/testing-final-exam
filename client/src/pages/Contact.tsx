import { Box, Heading, Text } from "@chakra-ui/react"
import Navbar from "../components/Navbar"

export default function Contact() {
    return (
        <>
            <Navbar />

            <Box p={8}>
                <Heading mb={4}>Welcome to the Hospital System</Heading>

                <Text>
                    here you will see how to contact the 'Hospital System', if you have any question or feedback for us.
                </Text>
            </Box>
        </>
    )
}