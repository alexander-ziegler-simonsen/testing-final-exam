import { Box, Button, Center, Text } from "@chakra-ui/react";
import { Link } from "react-router";

export default function Navbar() {
    function logoutFunction() {
        console.log("this is the logout button");
    }

    return (
        <Box w={"full"} alignItems={"center"} justifyContent={"center"} gap={6}
            display={"flex"} h={"auto"} p={2}
            shadow={"xl"}
            borderBottomWidth={1} borderBottomColor={"gray.400"}
            bgGradient="to-t" gradientFrom="gray.300" gradientTo="gray.500">
            {/* logo */}
            <Box bg={"gray.100"} padding={2} rounded={18} m={0}>
                <Link to={"/app"}>
                    <Text textStyle={"4xl"} fontSize={"4xl"} fontWeight={"bold"}>
                        Logo
                    </Text>
                </Link>
            </Box>

            {/* links */}
            <Box display={"flex"} gap={6} ml={8} marginEnd={"auto"}>
                Hello {localStorage.key(0) !== undefined ? localStorage.key(0) : "unkown person"}
            </Box>

            {/* book btn */}
            <Box display={"flex"}>
                <Button onClick={logoutFunction}>logout</Button>
            </Box>
        </Box>
    );
}
