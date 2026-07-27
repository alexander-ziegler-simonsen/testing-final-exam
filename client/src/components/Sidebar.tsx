import { Box, Button, CloseButton, Drawer, Flex, Portal, Text } from "@chakra-ui/react";
import { LuMenu, LuCircleX, LuPackage, LuBriefcaseMedical, LuPill, LuPillBottle, LuArchive, LuBuilding2, LuShapes, LuPackageMinus, LuOctagonAlert, LuBed, LuUserRound, LuMicroscope, LuMicrochip, LuContactRound, LuClipboardPen, LuHospital, LuHeartPulse, LuHandHeart, LuWarehouse, LuStethoscope, LuActivity, LuCalendar } from "react-icons/lu"
import SidebarElement from "./SidebarElement";
import { useState } from "react";

// interface MySidebarProps {
//     title?: string;
//     description?: string;
//     successText?: string;
//     cancelText?: string;
// }

// here I have given the props a type of MySidebarProps, which is an interface that I defined above. 
// This interface defines the shape of the props that the MySidebar component expects to receive.
// The props are all optional, as indicated by the question mark after each property name.
export default function MySidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    // Shared navigation list to avoid duplicating code
    const navigationLinks = (
        <>
            <SidebarElement path="departments" selected={false} title="departments" icon={<LuShapes size={32}  />} />
            <SidebarElement path="facilities" selected={false} title="facilities" icon={<LuBuilding2 size={32}  />} />
            <SidebarElement path="missing_medicin" selected={false} title="missing meds" icon={<LuPillBottle size={32}  />} />
            <SidebarElement path="patients" selected={false} title="patients" icon={<LuContactRound size={32}  />} />
            <SidebarElement path="staff" selected={false} title="staff" icon={<LuStethoscope size={32}  />} />
            <SidebarElement path="shifts" selected={false} title="shifts" icon={<LuCalendar size={32}  />} />
            <SidebarElement path="treatment" selected={false} title="treatment" icon={<LuHeartPulse size={32}  />} />
        </>
    );

    return (
        <>
            {/* 1. sidebar shown on bigger screens */}
            <Box h="calc(100vh - 64px)" w="300px" minW="300px" bg="bg.panel" borderRight="2px solid"
                borderColor="border" display={{ base: "none", md: "block" }} p="6">
                <Text fontWeight={"bold"} fontSize={22} textAlign={"center"} >Desktop Sidebar</Text>
                <hr />
                <br />
                {navigationLinks}
            </Box>

            {/* sidebar button */}
            {/* Positioned absolutely on mobile viewports so it stays accessible */}
            <Button display={{ base: "inline-flex", md: "none" }} position="fixed" bottom="4" left="4" zIndex="overlay" variant="solid" size="md" borderRadius="full" onClick={() => setIsMobileOpen(true)}>
                <LuMenu />
            </Button>

            {/* sidebar drawer overlay */}
            <Drawer.Root placement="start" open={isMobileOpen} onOpenChange={(e) => setIsMobileOpen(e.open)}>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content p="6">
                            <Drawer.Header>
                                <Drawer.Title>Navigation</Drawer.Title>
                            </Drawer.Header>

                            <Drawer.Body>
                                {navigationLinks}
                            </Drawer.Body>

                            {/* Chakra UI v3 close configuration */}
                            <Drawer.CloseTrigger asChild>
                                <Button variant="ghost" size="2xl" position="absolute" top="4" right="4">
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
