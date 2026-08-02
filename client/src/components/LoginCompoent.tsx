import { Button, Input, Text } from "@chakra-ui/react";
import { AuthService } from "../services/Auth";
import { useState } from "react";
import type { HospitalApiDtosOutputsLoginOutputDto } from "../api";
import { useAuthStore } from "../stores/AuthStore";

export default function LoginCompoent() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");


    async function loginFunc() {
        if (username.trim() !== "" && password.trim() !== "") {
            try {
                let response: HospitalApiDtosOutputsLoginOutputDto = await AuthService.login({ username: username, password: password });
                console.log("test", response);
                setFeedback("Login successful!");

                // set the store here
                useAuthStore.getState().setSession(response.token, {
                    firstName: response.firstname!,
                    lastName: response.lastname!,
                    role: response.role as any // TODO - fix this later
                })

            } catch (error: any) {
                console.error("login failed:", error);
                setFeedback(JSON.stringify(error.response?.data?.message || "Wrong username or password."));
            }
        }
        else {
            setFeedback("man! you forgot to fill the use and pass inputs, that is not okay man, try agian man!");
        }
    }

    return (
        <>
            <Input m={4} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="write username here" maxW={"300px"} /> <br />
            <Input m={4} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="write password here" maxW={"300px"} /> <br />
            <Button m={2} onClick={loginFunc}>login</Button>
            <Text m={2}>username: {username}</Text>
            <Text m={2}>password: {password}</Text>
            <Text m={2}>feedback: {feedback}</Text>
        </>
    );
}
