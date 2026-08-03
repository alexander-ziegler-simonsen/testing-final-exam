import { Box, Button, Drawer, Portal, Text } from "@chakra-ui/react";
import { LuMenu, LuCircleX, LuPillBottle, LuBuilding2, LuShapes, LuContactRound, LuHeartPulse, LuStethoscope, LuCalendar, LuUsersRound } from "react-icons/lu"
import SidebarElement from "./SidebarElement";
import { useState } from "react";
import { useAuthStore } from "../stores/AuthStore";

// interface MySidebarProps {
//     title?: string;
//     description?: string;
//     successText?: string;
//     cancelText?: string;
// }

// here I have given the props a type of MySidebarProps, which is an interface that I defined above.
// This interface defines the shape of the props that the MySidebar component expects to receive.
// The props are all optional, as indicated by the question mark after each property name.

type Role = 'doctor' | 'nurse' | 'admin' | 'patient'

interface NavigationLink {
    path: string;
    title: string;
    icon: React.ReactNode;
    testIdSuffix: string;
    // Omit to allow everyone. Must mirror the RoleProtectedRoute rules in App.tsx
    // so the sidebar never shows a link the router will then block.
    allowedRoles?: Role[];
}

const navigationLinks: NavigationLink[] = [
    { path: "departments", title: "departments", icon: <LuShapes size={32} />, testIdSuffix: "departments-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
    { path: "department_staff", title: "department staff", icon: <LuUsersRound size={32} />, testIdSuffix: "department-staff-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
    { path: "facilities", title: "facilities", icon: <LuBuilding2 size={32} />, testIdSuffix: "facilities-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
    { path: "missing_medicin", title: "missing meds", icon: <LuPillBottle size={32} />, testIdSuffix: "missing-medicin-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
    { path: "patients", title: "patients", icon: <LuContactRound size={32} />, testIdSuffix: "patients-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
    { path: "staff", title: "staff", icon: <LuStethoscope size={32} />, testIdSuffix: "staff-link", allowedRoles: ['admin'] },
    { path: "shifts", title: "shifts", icon: <LuCalendar size={32} />, testIdSuffix: "shifts-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
    { path: "treatment", title: "treatment", icon: <LuHeartPulse size={32} />, testIdSuffix: "treatment-link" },
];

export default function MySidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const user = useAuthStore((state) => state.user)

    // Shared navigation list to avoid duplicating code. Rendered once for the
    // desktop panel and once for the mobile drawer, both mounted in the DOM
    // at the same time, so each rendering needs its own testid prefix.
    const renderNavigationLinks = (testIdPrefix: string) => (
        <>
            {navigationLinks
                .filter((link) => !link.allowedRoles || (user && link.allowedRoles.includes(user.role)))
                .map((link) => (
                    <SidebarElement
                        key={link.path}
                        testId={`${testIdPrefix}-${link.testIdSuffix}`}
                        path={link.path}
                        selected={false}
                        title={link.title}
                        icon={link.icon}
                    />
                ))}
        </>
    );

    return (
        <>
            {/* 1. sidebar shown on bigger screens */}
            <Box h="calc(100vh - 64px)" w="300px" minW="300px" bg="bg.panel" borderRight="2px solid"
                borderColor="border" display={{ base: "none", md: "block" }} p="6" data-testid="sidebar-desktop">
                <Text fontWeight={"bold"} fontSize={22} textAlign={"center"} >Desktop Sidebar</Text>
                <hr />
                <br />
                {renderNavigationLinks("sidebar-desktop")}
            </Box>

            {/* sidebar button */}
            {/* Positioned absolutely on mobile viewports so it stays accessible */}
            <Button data-testid="sidebar-mobile-toggle-button" display={{ base: "inline-flex", md: "none" }} position="fixed" bottom="4" left="4" zIndex="overlay" variant="solid" size="md" borderRadius="full" onClick={() => setIsMobileOpen(true)}>
                <LuMenu />
            </Button>

            {/* sidebar drawer overlay */}
            <Drawer.Root placement="start" open={isMobileOpen} onOpenChange={(e) => setIsMobileOpen(e.open)}>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content p="6" data-testid="sidebar-mobile-drawer">
                            <Drawer.Header>
                                <Drawer.Title>Navigation</Drawer.Title>
                            </Drawer.Header>

                            <Drawer.Body>
                                {renderNavigationLinks("sidebar-mobile")}
                            </Drawer.Body>

                            {/* Chakra UI v3 close configuration */}
                            <Drawer.CloseTrigger asChild>
                                <Button data-testid="sidebar-mobile-drawer-close-button" variant="ghost" size="2xl" position="absolute" top="4" right="4">
                                    <LuCircleX />
                                </Button>
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </>
    );
}
