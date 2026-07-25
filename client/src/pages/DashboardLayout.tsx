import { Box, Heading, Text, Stack, Container } from "@chakra-ui/react";
import { Outlet } from "react-router";
import MySidebar from "../components/Sidebar";
import Navbar from "../components/public/Navbar";

export default function DashboardLayout() {
    return (
        <>
            <MySidebar />
            <Navbar />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}