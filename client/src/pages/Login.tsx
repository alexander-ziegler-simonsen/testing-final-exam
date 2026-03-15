import { Box, Button, Heading, Input, VStack, Field } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router"

export default function Login() {
    const navigate = useNavigate()

    return (
        <>
            <Navbar />
            <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="md">
                <Heading mb={6}>Login</Heading>

                <VStack gap={4}>
                    <Field.Root>
                        <Field.Label>Email</Field.Label>
                        <Input placeholder="email@example.com" />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <Input type="password" placeholder="password" />
                    </Field.Root>

                    <Button id="loginBtn" bg="blue.500" width="100%">
                        Login
                    </Button>
                </VStack>
            </Box>
            <hr/>
            <hr/>
            <hr/>

            <Box p={8}>
                <Heading mb={6}>Login (Demo)</Heading>

                <VStack gap={4} align="start">
                    <Button bg="blue.500" onClick={() => navigate("/patient")}>
                        Login as Patient
                    </Button>

                    <Button bg="blue.500" onClick={() => navigate("/doctor")}>
                        Login as Doctor
                    </Button>

                    <Button bg="blue.500" onClick={() => navigate("/nurse")}>
                        Login as Nurse
                    </Button>

                    <Button bg="blue.500" onClick={() => navigate("/admin")}>
                        Login as Admin
                    </Button>
                </VStack>
            </Box>
        </>
    )
}