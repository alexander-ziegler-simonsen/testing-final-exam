import { Flex, Box, Button, Heading, Spacer } from "@chakra-ui/react"
import { Link } from "react-router"
import { authService } from "../services/AuthService"

const roleIcons: Record<string, string> = {
    admin: "🛡️",
    doctor: "🩺",
    nurse: "💉",
    patient: "🏥",
}

export default function Navbar() {
    const role = authService.getRole()
    const roleIcon = role ? roleIcons[role] ?? null : null

    const navItems = [
        { id: "NavHomeBtn", to: "/", label: "Home" },
        { id: "NavAboutBtn", to: "/about", label: "About" },
        { id: "NavContactBtn", to: "/contact", label: "Contact" },
        { id: "NavLoginBtn", to: "/login", label: "Login" },
        { id: "navLocationBtn", to: "/locations", label: "locations"}
    ];

    return (
        <Box bg="blue.500" color="white">
            <Flex maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={4} align="center">
                <Heading size="md">Hospital System {roleIcon}</Heading>

                <Spacer />

                <Box>
                    {navItems.map((item) => (
                        <Button key={item.id} id={item.id} asChild variant="outline" color="white" mr={2} >
                            <Link to={item.to}>{item.label}</Link>
                        </Button>
                    ))}
                </Box>
            </Flex>
        </Box>
    )
}