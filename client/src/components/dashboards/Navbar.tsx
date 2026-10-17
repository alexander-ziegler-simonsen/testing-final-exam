import { Box, Button, HStack, Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link } from "react-router";
import type { IconType } from "react-icons";
import { LuShieldCheck, LuStethoscope, LuSyringe, LuUser } from "react-icons/lu";
import { useAuthStore } from "../../stores/AuthStore";
import { AuthService } from "../../services/auth/Auth";

const navLinks = [
  { label: "facilities", to: "/app/facilities" },
  { label: "Patients", to: "/app/patients" },
  { label: "Medicin", to: "/app/medicin" },
  { label: "Rooms", to: "/app/rooms" },
  { label: "staff", to: "/app/staff" },
  { label: "settings", to: "/app/settings" },
];

const roleIcons: Record<string, { icon: IconType; color: string }> = {
  admin: { icon: LuShieldCheck, color: "purple.600" },
  doctor: { icon: LuStethoscope, color: "blue.600" },
  nurse: { icon: LuSyringe, color: "teal.600" },
  patient: { icon: LuUser, color: "gray.700" },
};

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const role = user?.role?.toLowerCase();
  const roleIcon = role ? roleIcons[role] : undefined;

  function logoutFunction() {
    // Clear local session immediately so the UI reacts right away; revoke the
    // refresh token server-side in the background (best-effort, non-blocking).
    clearSession();
    AuthService.logout().catch(() => {
      // local session is already cleared either way
    });
  }

  return (
    <Box w={"full"} alignItems={"center"} justifyContent={"center"} gap={6} display={"flex"} h={"auto"} p={2} shadow={"xl"} 
    borderBottomWidth={1} borderBottomColor={"gray.400"} bgGradient="to-t" gradientFrom="gray.300" gradientTo="gray.500" data-testid="dashboard-navbar">
      {/* logo */}
      <Box bg={"gray.100"} padding={2} rounded={18} m={0}>
        <Link data-testid="dashboard-navbar-logo-link" to={"/app"}>
          <Text textStyle={"4xl"} fontSize={"4xl"} fontWeight={"bold"}>Logo</Text>
        </Link>
      </Box>

      {/* links */}
      <Box display={"flex"} alignItems={"center"} gap={2} ml={8} marginEnd={"auto"} data-testid="dashboard-navbar-user-greeting">
        {roleIcon && (
          <Icon as={roleIcon.icon} boxSize={6} color={roleIcon.color} aria-label={role} data-testid={`dashboard-navbar-role-icon-${role}`} />
        )}
        <Text textStyle={"xl"}>{user ? `${user.firstName} ${user.lastName}` : "unknown person"}</Text>
      </Box>

      <HStack as="nav" gap={4} data-testid="dashboard-navbar-links">
        {navLinks.map((link) => (
          <ChakraLink key={link.to} asChild fontWeight={"medium"} px={3} py={1} rounded={"md"} _hover={{ bg: "gray.100" }}>
            <Link to={link.to}>{link.label}</Link>
          </ChakraLink>
        ))}
      </HStack>

      {/* book btn */}
      <Box display={"flex"}>
        <Button data-testid="dashboard-navbar-logout-button" onClick={logoutFunction}>logout</Button>
      </Box>
    </Box>
  );
}
