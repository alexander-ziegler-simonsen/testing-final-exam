import { Box, Heading, Text, Stack, Button } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";
import { Link } from "react-router";

export default function Login() {
  return (
    <>
      <Navbar />
      <div>
        <p>this is login page</p>
        <Link id="nav-doctors-link" to="/dashboard">
          dashboard
        </Link>
      </div>
    </>
  );
}
