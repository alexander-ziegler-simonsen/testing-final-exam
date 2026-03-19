import { Flex, Box, Button, Heading, Spacer } from "@chakra-ui/react"
import { Link } from "react-router"



export default function Navbar() {

    const navItems = [
        { id: "NavHomeBtn", to: "/", label: "Home" },
        { id: "NavAboutBtn", to: "/about", label: "About" },
        { id: "NavContactBtn", to: "/contact", label: "Contact" },
        { id: "NavLoginBtn", to: "/login", label: "Login" },
    ];

    return (
        <Flex bg="blue.500" p={4} color="white" align="center">
            <Heading size="md">Hospital System</Heading>

            <Spacer />

            <Box>
                {navItems.map((item) => (
                    <Button key={item.id} id={item.id} asChild variant="outline" color="white" mr={2} >
                        <Link to={item.to}>{item.label}</Link>
                    </Button>
                ))}
            </Box>
        </Flex>
    )
}