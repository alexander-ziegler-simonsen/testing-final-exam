import { Heading, Stack, Text } from "@chakra-ui/react";
import { LuHospital } from "react-icons/lu";

export default function Overview() {
  return (
    <Stack gap={4} p={4} maxW="2xl">
      <LuHospital size={48} />
      <Heading size="2xl" data-testid="overview-page-heading">Welcome to the Hospital System</Heading>
      <Text data-testid="overview-page-text">
        Use the menu on the left to manage patients, staff, departments, rooms and medicine.
      </Text>
    </Stack>
  );
}
