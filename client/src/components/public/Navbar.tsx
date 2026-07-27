import { Box, Button, Center, Text } from "@chakra-ui/react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <Box w={"full"} alignItems={"center"} justifyContent={"center"} gap={6} 
    display={"flex"} h={"auto"} p={2} 
    shadow={"xl"} 
    borderBottomWidth={1} borderBottomColor={"gray.400"}
    marginBottom={1}
    bgGradient="to-t" gradientFrom="gray.300" gradientTo="gray.500">
      {/* logo */}
      <Box bg={"gray.100"}>
        <Text textStyle={"4xl"} fontSize={"4xl"} fontWeight={"bold"}>
          Logo
        </Text>
      </Box>

      {/* links */}
      <Box display={"flex"} gap={6} ml={8}>
        <Link id="nav-home-link" to="/">
          Home
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
