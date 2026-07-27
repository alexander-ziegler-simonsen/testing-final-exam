import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router";

interface SidebarElementProps {
    selected: boolean,
    title: string,
    icon: React.ReactNode; // Type for JSX elements like <LuCircleX />
    path: string
}

export default function SidebarElement({ selected, title, icon, path }: SidebarElementProps) {
    return (
        <>
            <Box bg={selected ? "red.100" : "transparent"}>
                <HStack gap={2}>
                    <Box marginRight={4}>{icon}</Box>
                    <Box marginEnd={"auto"}><Text fontWeight={"bold"} >{title}</Text></Box>
                    <Box><Button variant={"outline"} p={3} fontWeight={"bold"} fontSize={18} rounded={48}><Link to={path}>open</Link></Button></Box>
                </HStack>
            </Box>
            <br />
        </>

    );
}
