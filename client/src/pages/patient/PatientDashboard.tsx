import { Box, Heading, Text } from "@chakra-ui/react"
import Navbar from "../../components/Navbar"

export default function PatientDashboard() {

    // here we do the logic
    

    return (
        <>
            <Navbar />

            <Box p={8}>
                <Heading mb={4}>Patient Dashboard</Heading>
                <Text>View appointments and medical information.</Text>
            </Box>
        </>
    )
}