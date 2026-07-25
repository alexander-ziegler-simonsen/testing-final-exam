import { Box } from "@chakra-ui/react";
import { Link } from "react-router";

interface SidebarElementProps {
    selected: boolean,
    title: string,
    icon: string,
    path: string
}

export default function SidebarElement({selected, title, icon, path}: SidebarElementProps) {
    return (
        <Box bg={ selected ? "red.100" : "transparent" }>
            <p>|Icon-{icon}| {title}</p> <Link to={path}>|open|</Link>
        </Box>
    );
}
