import { Box, Heading, Text } from "@chakra-ui/react"

export default function About() {
    return (
        <>
            <Box p={8}>
                <Heading mb={4}>Welcome to the Hospital System</Heading>

                <Text>
                    we here at 'Hospital System', like to handle patients with care.
                </Text>
            </Box>
        </>
    )
}