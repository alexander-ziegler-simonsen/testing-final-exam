import { Box, Button, Container, Drawer, HStack, Portal, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router";
import { HeartPulse, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { testId: "nav-home-link", to: "/", label: "Home" },
  { testId: "nav-about-link", to: "/about", label: "About" },
  { testId: "nav-doctors-link", to: "/doctors", label: "Doctors" },
  { testId: "nav-contact-link", to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <Box
      w={"full"}
      bg={"gray.800"}
      shadow={"sm"}
      position={"sticky"}
      top={0}
      zIndex={10}
      data-testid="public-navbar"
    >
      <Container maxW={"7xl"}>
        <HStack justify={"space-between"} py={3}>
          <Link to="/" data-testid="public-navbar-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box bg={"green.600"} p={2} borderRadius={"lg"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
              <HeartPulse color="white" size={20} />
            </Box>
            <Text fontSize={"xl"} fontWeight={"bold"} color={"white"}>
              Danish Hospital
            </Text>
          </Link>

          <HStack gap={8} display={{ base: "none", md: "flex" }}>
            {links.map((link) => (
              <Link
                key={link.testId}
                data-testid={link.testId}
                to={link.to}
                style={{ color: "#D1D5DB", fontWeight: 500 }}
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          <HStack gap={3}>
            <Button
              asChild
              display={{ base: "none", md: "inline-flex" }}
              colorPalette={"green"}
              bg={"green.600"}
              color={"white"}
              _hover={{ bg: "green.700" }}
              borderRadius={"full"}
              px={6}
            >
              <Link data-testid="nav-book-link" to="/appointment">
                Book now
              </Link>
            </Button>

            <Button
              data-testid="nav-mobile-menu-toggle"
              display={{ base: "inline-flex", md: "none" }}
              variant={"ghost"}
              color={"white"}
              _hover={{ bg: "gray.700" }}
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu />
            </Button>
          </HStack>
        </HStack>
      </Container>

      <Drawer.Root placement={"end"} open={isMobileOpen} onOpenChange={(e) => setIsMobileOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content p={"6"} bg={"gray.800"} data-testid="nav-mobile-drawer">
              <Drawer.Header px={0}>
                <Drawer.Title color={"white"}>Menu</Drawer.Title>
              </Drawer.Header>

              <Drawer.Body px={0}>
                <Stack align={"stretch"} gap={5}>
                  {links.map((link) => (
                    <Link
                      key={link.testId}
                      data-testid={`nav-mobile-${link.testId}`}
                      to={link.to}
                      onClick={() => setIsMobileOpen(false)}
                      style={{ color: "#D1D5DB", fontWeight: 500, fontSize: "1.1rem" }}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <Button
                    asChild
                    colorPalette={"green"}
                    bg={"green.600"}
                    color={"white"}
                    _hover={{ bg: "green.700" }}
                    borderRadius={"full"}
                    mt={2}
                  >
                    <Link data-testid="nav-mobile-book-link" to="/appointment" onClick={() => setIsMobileOpen(false)}>
                      Book now
                    </Link>
                  </Button>
                </Stack>
              </Drawer.Body>

              <Drawer.CloseTrigger asChild>
                <Button
                  data-testid="nav-mobile-drawer-close-button"
                  variant={"ghost"}
                  color={"white"}
                  _hover={{ bg: "gray.700" }}
                  position={"absolute"}
                  top={4}
                  right={4}
                >
                  <X />
                </Button>
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
}
