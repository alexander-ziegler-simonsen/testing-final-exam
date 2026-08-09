import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router";

interface SidebarElementProps {
    selected: boolean,
    title: string,
    icon: React.ReactNode; // Type for JSX elements like <LuCircleX />
    path: string
    // data-testid for this entry, supplied by the caller. Sidebar renders
    // this same list twice (desktop panel + mobile drawer), so the caller
    // must pass a distinct prefix per rendering to keep testids unique.
    testId: string
}

export default function SidebarElement({ selected, title, icon, path, testId }: Readonly<SidebarElementProps>) {
    return (
        <>
            <Box bg={selected ? "red.100" : "transparent"} data-testid={testId}>
                <HStack gap={2}>
                    <Box marginRight={4}>{icon}</Box>
                    <Box marginEnd={"auto"}><Text fontWeight={"bold"} >{title}</Text></Box>
                    <Box><Link to={path}><Button data-testid={`${testId}-open-button`} variant={"outline"} p={3} fontWeight={"bold"} fontSize={18} rounded={48}>open</Button></Link></Box>
                </HStack>
            </Box>
            <br />
        </>

    );
}
