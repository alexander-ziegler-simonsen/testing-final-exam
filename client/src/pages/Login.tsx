import { useState } from "react"
import { Box, Button, Heading, Input, VStack, Field, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router"
import { authService } from "../services/AuthService"

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setError(null)
        setLoading(true)

        try {
            const result = await authService.login(username, password)

            localStorage.setItem("token", result.token)
            localStorage.setItem("role", result.role)
            localStorage.setItem("staffId", result.staffId.toString())
            localStorage.setItem("firstname", result.firstname ?? "")
            localStorage.setItem("lastname", result.lastname ?? "")
            localStorage.setItem("loginTime", Date.now().toString())

            switch (result.role) {
                case "doctor":
                    navigate("/doctor");
                    break
                case "nurse":
                    navigate("/nurse");
                    break
                case "admin":
                    navigate("/admin");
                    break
                default:
                    navigate("/");
                    break
            }
        } catch {
            setError("Invalid username or password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="md">
            <Heading mb={6}>Login</Heading>

            <VStack gap={4}>
                <Field.Root>
                    <Field.Label>Username</Field.Label>
                    <Input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input type="password" placeholder="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                </Field.Root>

                {error && <Text color="red.500">{error}</Text>}

                <Button bg="blue.500" width="100%" onClick={handleLogin} loading={loading}>
                    Login
                </Button>
            </VStack>
        </Box>
    )
}
