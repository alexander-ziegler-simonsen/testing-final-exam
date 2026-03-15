import { Box, Heading, Text } from "@chakra-ui/react"
import Navbar from "../../components/Navbar"

export default function DoctorDashboard() {
    return (
        <>
            <Navbar />

            <Box p={8}>
                <Heading>Doctor Dashboard</Heading>
                <Text>View full infomation of all patients.</Text>
            </Box>
        </>
    )
}