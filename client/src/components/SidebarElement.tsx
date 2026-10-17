import { Box, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router";

interface SidebarElementProps {
    selected: boolean,
    title: string,
    icon: React.ReactNode; // Type for JSX elements like <LuCircleX />
    path: string
    testId: string
}

export default function SidebarElement({ selected, title, icon, path, testId }: Readonly<SidebarElementProps>) {
    return (
        <Box data-testid={testId}>
            <HStack asChild gap={3} px={3} py={2} rounded="md" bg={selected ? "red.subtle" : "transparent"} _hover={{ bg: selected ? "red.subtle" : "bg.muted" }}>
                <Link to={path} data-testid={`${testId}-open-button`} aria-current={selected ? "page" : undefined}>
                    {icon}
                    <Text fontWeight={selected ? "bold" : "medium"}>{title}</Text>
                </Link>
            </HStack>
        </Box>
    );
}
