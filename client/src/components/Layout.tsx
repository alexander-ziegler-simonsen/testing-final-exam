import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router"
import Navbar from "./Navbar"

export default function Layout() {
    return (
        <>
            <Navbar />
            <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }}>
                <Outlet />
            </Box>
        </>
    )
}
