import { Flex, Box, Button, Heading, Spacer } from "@chakra-ui/react"
import { Link } from "react-router"

export default function Navbar() {
    return (
        <Flex bg="blue.500" p={4} color="white" align="center">
            <Heading size="md">Hospital System</Heading>

            <Spacer />

            <Box>
                <Button id="NavHomeBtn" asChild variant="ghost" color="white" mr={2}>
                    <Link to="/">Home</Link>
                </Button>

                <Button id="NavAboutBtn" asChild variant="ghost" color="white" mr={2}>
                    <Link to="/about">About</Link>
                </Button>

                <Button id="NavContactBtn" asChild variant="ghost" color="white" mr={2}>
                    <Link to="/contact">Contact</Link>
                </Button>

                <Button id="NavLoginBtn" asChild colorScheme="teal">
                    <Link to="/login">Login</Link>
                </Button>
            </Box>
        </Flex>
    )
}