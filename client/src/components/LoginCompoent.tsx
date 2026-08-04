import { Box, Button, Center, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { AuthService } from "../services/Auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { HospitalApiDtosOutputsLoginOutputDto } from "../api";
import { useAuthStore } from "../stores/AuthStore";

export default function LoginCompoent() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const navigate = useNavigate();

    async function loginFunc() {
        if (username.trim() !== "" && password.trim() !== "") {
            try {
                let response: HospitalApiDtosOutputsLoginOutputDto = await AuthService.login({ username: username, password: password });
                setFeedback("Login successful!");
                setLoginFailed(false);

                // set the store here
                useAuthStore.getState().setSession(response.token, {
                    staffId: response.staffId ?? null,
                    firstName: response.firstname!,
                    lastName: response.lastname!,
                    role: response.role as any // TODO - fix this later
                })

                navigate("/app", { replace: true });

            } catch (error: any) {
                console.error("login failed:", error);
                setFeedback(JSON.stringify(error.response?.data?.message || "Wrong username or password."));
                setLoginFailed(true);
            }
        }
        else {
            setFeedback("Please fill in both your username and password.");
            setLoginFailed(true);
        }
    }

    return (
        <Center px={4}>
            <Box bg={"white"} shadow={"lg"} borderRadius={"2xl"} p={{ base: 5, md: 6 }} w={"full"} maxW={"380px"}>
                <Heading as={"h1"} size={"lg"} mb={4} textAlign={"center"}>
                    Login
                </Heading>
                <Stack gap={3}>
                    <Input
                        data-testid="login-username-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        size={"lg"}
                    />
                    <Input
                        data-testid="login-password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        size={"lg"}
                    />
                    <Button
                        data-testid="login-submit-button"
                        onClick={loginFunc}
                        colorPalette={"green"}
                        bg={"green.600"}
                        _hover={{ bg: "green.700" }}
                        color={"white"}
                        size={"lg"}
                    >
                        Login
                    </Button>
                    {loginFailed && (
                        <Text data-testid="login-feedback-text" color={"red.500"} fontSize={"sm"} textAlign={"center"}>
                            {feedback}
                        </Text>
                    )}
                </Stack>
            </Box>
        </Center>
    );
}
