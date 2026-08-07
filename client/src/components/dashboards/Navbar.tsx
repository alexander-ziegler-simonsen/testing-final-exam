import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router";
import { useAuthStore } from "../../stores/AuthStore";

export default function Navbar() {
    const user = useAuthStore((state) => state.user);
    const clearSession = useAuthStore((state) => state.clearSession);

    function logoutFunction() {
        clearSession();
    }

    return (
        <Box w={"full"} alignItems={"center"} justifyContent={"center"} gap={6}
            display={"flex"} h={"auto"} p={2}
            shadow={"xl"}
            borderBottomWidth={1} borderBottomColor={"gray.400"}
            bgGradient="to-t" gradientFrom="gray.300" gradientTo="gray.500"
            data-testid="dashboard-navbar">
            {/* logo */}
            <Box bg={"gray.100"} padding={2} rounded={18} m={0}>
                <Link data-testid="dashboard-navbar-logo-link" to={"/app"}>
                    <Text textStyle={"4xl"} fontSize={"4xl"} fontWeight={"bold"}>Logo</Text>
                </Link>
            </Box>

            {/* links */}
            <Box display={"flex"} gap={6} ml={8} marginEnd={"auto"} data-testid="dashboard-navbar-user-greeting">
                Hello {user ? `${user.firstName} ${user.lastName}` : "unknown person"}
            </Box>

            {/* book btn */}
            <Box display={"flex"}>
                <Button data-testid="dashboard-navbar-logout-button" onClick={logoutFunction}>logout</Button>
            </Box>
        </Box>
    );
}
