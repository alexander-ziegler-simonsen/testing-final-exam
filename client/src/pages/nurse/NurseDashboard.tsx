import { Box, Heading, Text } from "@chakra-ui/react"
import Navbar from "../../components/Navbar"

export default function NurseDashboard() {
    return (
        <>
            <Navbar />

            <Box p={8}>
                <Heading>Nurse Dashboard</Heading>
                <Text>View 'some' infomation of all patients.</Text>
            </Box>
        </>
    )
}