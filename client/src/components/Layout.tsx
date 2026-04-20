import { useEffect } from "react"
import { Box } from "@chakra-ui/react"
import { Outlet, useNavigate } from "react-router"
import Navbar from "./Navbar"
import { authService } from "../services/AuthService"

export default function Layout() {
    const navigate = useNavigate()

    useEffect(() => {
        const loginTime = localStorage.getItem("loginTime")
        if (loginTime && !authService.isLoggedIn()) {
            navigate("/", { replace: true })
        }
    })

    return (
        <>
            <Navbar />
            <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }}>
                <Outlet />
            </Box>
        </>
    )
}
