import { Box, Heading, Text } from "@chakra-ui/react"
import Navbar from "../../components/Navbar"

export default function AdminDashboard() {
    return (
        <>
            <Navbar />

            <Box p={8}>
                <Heading>Admin Dashboard</Heading>
                <Text>View 'everything about everything'</Text>
            </Box>
        </>
    )
}