import { Accordion, Box, Button, Drawer, Portal, Text } from "@chakra-ui/react";
import { LuMenu, LuCircleX, LuPillBottle, LuBuilding2, LuShapes, LuContactRound, LuHeartPulse, LuStethoscope, LuUsersRound, LuWarehouse, LuCalendarClock, LuSearch, LuSyringe, LuBaby, LuLayoutDashboard } from "react-icons/lu"
import SidebarElement from "./SidebarElement";
import { useState } from "react";
import { matchPath, useLocation } from "react-router";
import { useAuthStore } from "../stores/AuthStore";

type Role = 'doctor' | 'nurse' | 'admin' | 'patient'

interface NavigationLink {
    path: string;
    title: string;
    icon: React.ReactNode;
    testIdSuffix: string;
    allowedRoles?: Role[];
}

interface NavigationGroup {
    id: string;
    title: string;
    links: NavigationLink[];
}

const overviewLink: NavigationLink = { path: "overview", title: "overview", icon: <LuLayoutDashboard size={20} />, testIdSuffix: "overview-link", allowedRoles: ['doctor', 'nurse', 'admin'] };

const navigationGroups: NavigationGroup[] = [
    {
        id: "patient-care", title: "Patient care", links: [
            { path: "patients", title: "patients", icon: <LuContactRound size={20} />, testIdSuffix: "patients-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "register_baby", title: "register baby", icon: <LuBaby size={20} />, testIdSuffix: "register-baby-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "treatment", title: "treatment", icon: <LuHeartPulse size={20} />, testIdSuffix: "treatment-link" },
            { path: "give_treatment", title: "give treatment", icon: <LuSyringe size={20} />, testIdSuffix: "give-treatment-link", allowedRoles: ['nurse', 'admin'] },
        ]
    },
    {
        id: "medicine", title: "Medicine", links: [
            { path: "missing_medicin", title: "missing meds", icon: <LuPillBottle size={20} />, testIdSuffix: "missing-medicin-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "medicin_storage", title: "medicin storage", icon: <LuWarehouse size={20} />, testIdSuffix: "medicin-storage-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "external_medicin", title: "find medicin price", icon: <LuSearch size={20} />, testIdSuffix: "external-medicin-link" },
        ]
    },
    {
        id: "facilities", title: "Facilities", links: [
            { path: "facilities", title: "facilities", icon: <LuBuilding2 size={20} />, testIdSuffix: "facilities-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "room_booking", title: "room booking", icon: <LuCalendarClock size={20} />, testIdSuffix: "room-booking-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
        ]
    },
    {
        id: "organisation", title: "Organisation", links: [
            { path: "departments", title: "departments", icon: <LuShapes size={20} />, testIdSuffix: "departments-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "department_staff", title: "department staff", icon: <LuUsersRound size={20} />, testIdSuffix: "department-staff-link", allowedRoles: ['doctor', 'nurse', 'admin'] },
            { path: "staff", title: "staff", icon: <LuStethoscope size={20} />, testIdSuffix: "staff-link", allowedRoles: ['admin'] },
        ]
    },
];


const allGroupIds = navigationGroups.map((group) => group.id);

export default function MySidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const user = useAuthStore((state) => state.user)
    const { pathname } = useLocation()

    const canSee = (link: NavigationLink) => !link.allowedRoles || (user && link.allowedRoles.includes(user.role));

    
    const isSelected = (link: NavigationLink) => matchPath({ path: `/app/${link.path}`, end: false }, pathname) !== null;

    const renderLink = (link: NavigationLink, testIdPrefix: string) => (
        <SidebarElement key={link.path} testId={`${testIdPrefix}-${link.testIdSuffix}`} path={link.path} selected={isSelected(link)} title={link.title} icon={link.icon} />
    );

    const renderNavigation = (testIdPrefix: string) => (
        <>
            {canSee(overviewLink) && <Box mb={2}>{renderLink(overviewLink, testIdPrefix)}</Box>}

            <Accordion.Root multiple defaultValue={allGroupIds}>
                {navigationGroups
                    .map((group) => ({ ...group, links: group.links.filter(canSee) }))
                    .filter((group) => group.links.length > 0)
                    .map((group) => (
                        <Accordion.Item key={group.id} value={group.id} data-testid={`${testIdPrefix}-group-${group.id}`}>
                            <Accordion.ItemTrigger data-testid={`${testIdPrefix}-group-${group.id}-toggle`}>
                                <Text flex="1" fontWeight={"bold"} fontSize={18}>{group.title}</Text>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody pl={2}>
                                    {group.links.map((link) => renderLink(link, testIdPrefix))}
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
            </Accordion.Root>
        </>
    );

    return (
        <>
            {/* 1. sidebar shown on bigger screens */}
            <Box h="calc(100vh - 64px)" w="300px" minW="300px" bg="bg.panel" borderRight="2px solid" overflowY="auto"
                borderColor="border" display={{ base: "none", md: "block" }} p="6" data-testid="sidebar-desktop">
                <Text fontWeight={"bold"} fontSize={22} textAlign={"center"} >Navigation</Text>
                <hr />
                <br />
                {renderNavigation("sidebar-desktop")}
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

                            <Drawer.Body>{renderNavigation("sidebar-mobile")}</Drawer.Body>

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
