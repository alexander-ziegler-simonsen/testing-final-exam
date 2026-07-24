import { Bleed, Box, Button, Center, Text } from "@chakra-ui/react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <Box w={"full"} alignItems={"center"} justifyContent={"center"} gap={6} display={"flex"} h={"auto"} marginBottom={2} p={2} bg={"gray.100"}>
      <Box bg={"gray.100"}>
        <Center>
          <Text id="nav-logo" fontSize="2xl" fontWeight="bold">
          Hospital
        </Text>
        </Center>
      </Box>

      {/* logo */}

      {/* links */}
      <Box display={"flex"} gap={6} ml={8}>
        <Link id="nav-home-link" to="/">
          Home tgs
        </Link>
        <Link id="nav-about-link" to="/about">
          About
        </Link>
        <Link id="nav-doctors-link" to="/doctors">
          Doctors
        </Link>
        <Link id="nav-contact-link" to="/contact">
          Contact
        </Link>
      </Box>

      {/* book btn */}
      <Box display={"flex"}>
        <Button asChild colorScheme="blue">
          <Link id="nav-book-link" to="/appointment">
            Book Now
          </Link>
        </Button>
      </Box>
    </Box>
  );
}
