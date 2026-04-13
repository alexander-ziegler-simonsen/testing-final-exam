import { Box, Heading, Text } from "@chakra-ui/react"

export default function Home() {
    return (
        <>
            <Box p={8}>
                <Heading mb={4}>Welcome to the Hospital System</Heading>

                <Text>
                    This system allows patients, nurses, doctors, and administrators
                    to manage hospital operations efficiently.
                </Text>
            </Box>
        </>
    )
}