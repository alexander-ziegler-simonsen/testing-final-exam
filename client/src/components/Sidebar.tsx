import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu"
import SidebarElement from "./SidebarElement";

interface MySidebarProps {
    title?: string;
    description?: string;
    successText?: string;
    cancelText?: string;
}

// here I have given the props a type of MySidebarProps, which is an interface that I defined above. 
// This interface defines the shape of the props that the MySidebar component expects to receive.
// The props are all optional, as indicated by the question mark after each property name.
export default function MySidebar({ successText, cancelText }: MySidebarProps) {
    return (
        // placement, say where is comes from - options: top, right, bottom, left
        <Drawer.Root placement="start">
            {/* this part handles the trigger */}
            <Drawer.Trigger asChild>
                <Button variant="outline" size="sm">
                    {/* this is a hamburger icon - from @chakra-ui/icons */}
                    <LuMenu />
                </Button>
            </Drawer.Trigger>

            {/* this part handles the content */}
            <Portal>
                {/* some styling */}
                <Drawer.Backdrop />

                <Drawer.Positioner>
                    <Drawer.Content>
                        {/* this part handles the header */}
                        <Drawer.Header>
                            <Drawer.Title>title</Drawer.Title>
                        </Drawer.Header>
                        {/* this part handles the body */}
                        <Drawer.Body>
                            {/* <p>description</p> */}

                            <SidebarElement path="departments" selected={false} title="departments" icon="i" />
                            <SidebarElement path="facilities" selected={false} title="facilities" icon="i" />
                            <SidebarElement path="missing_medicin" selected={false} title="missing_medicin" icon="i" />
                            <SidebarElement path="patients" selected={false} title="patients" icon="i" />
                            <SidebarElement path="staff" selected={false} title="staff" icon="i" />
                            <SidebarElement path="shifts" selected={false} title="shifts" icon="i" />
                            <SidebarElement path="treatment" selected={false} title="treatment" icon="i" />
                            
                        </Drawer.Body>
                        {/* this part handles the footer */}
                        <Drawer.Footer>
                            <Button variant="outline">{cancelText}</Button>
                            <Button>{successText}</Button>
                        </Drawer.Footer>

                        {/* this part handles the close trigger */}
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}
