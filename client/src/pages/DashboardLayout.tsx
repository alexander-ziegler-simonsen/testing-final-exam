import { Container, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router";
import MySidebar from "../components/Sidebar";
import Navbar from "../components/dashboards/Navbar";

export default function DashboardLayout() {
    return (
        <>
            <Flex direction="column" minH="100vh">
                <Navbar />

                {/* Flex horizontal layout for sidebar and body */}
                <Flex flex="1" w="100%">
                    <MySidebar />

                    {/* Main page content area */}
                    <Container flex="1" p="6" maxW="full" data-testid="dashboard-main-content">
                        <Outlet />
                    </Container>
                </Flex>
            </Flex>
        </>
    );
}