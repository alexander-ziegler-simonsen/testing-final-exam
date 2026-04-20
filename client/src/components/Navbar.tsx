import { Flex, Box, Button, Heading, Spacer } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router"
import { authService } from "../services/AuthService"

const roleIcons: Record<string, string> = {
    admin: "🛡️",
    doctor: "🩺",
    nurse: "💉",
    patient: "🏥",
}

export default function Navbar() {
    const navigate = useNavigate()
    const isLoggedIn = authService.isLoggedIn()
    const role = authService.getRole()
    const roleIcon = role ? roleIcons[role] ?? null : null

    const handleLogout = () => {
        authService.logout()
        navigate("/", { replace: true })
    }

    const navItems = [
        { id: "NavHomeBtn", to: "/", label: "Home" },
        { id: "NavAboutBtn", to: "/about", label: "About" },
        { id: "NavContactBtn", to: "/contact", label: "Contact" },
        { id: "navLocationBtn", to: "/locations", label: "locations"}
    ];

    return (
        <Box bg="blue.500" color="white">
            <Flex maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={4} align="center">
                <Heading size="md">Hospital System {roleIcon}</Heading>

                <Spacer />

                <Box>
                    {navItems.map((item) => (
                        <Button key={item.id} id={item.id} asChild variant="outline" color="white" mr={2}>
                            <Link to={item.to}>{item.label}</Link>
                        </Button>
                    ))}

                    {isLoggedIn ? (
                        <Button id="NavLogoutBtn" variant="outline" borderColor="red.300" borderWidth="2px" color="red.300" bg="transparent" _hover={{ borderColor: "red.200", color: "red.200", bg: "transparent" }} onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button id="NavLoginBtn" asChild variant="outline" color="white">
                            <Link to="/login">Login</Link>
                        </Button>
                    )}
                </Box>
            </Flex>
        </Box>
    )
}