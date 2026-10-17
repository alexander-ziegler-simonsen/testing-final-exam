import { Tabs, Text } from "@chakra-ui/react";
import StaffAccountsTab from "../../components/dashboards/staff/StaffAccountsTab";
import DepartmentStaffTab from "../../components/dashboards/staff/DepartmentStaffTab";

export default function StaffDashboard() {
  return (
    <>
      <Text data-testid="placeholderText">StaffDashboard</Text>
      <Tabs.Root defaultValue="users" data-testid="staff-tabs">
        <Tabs.List mb="4">
          <Tabs.Trigger value="users" data-testid="staff-tab-users">Staff</Tabs.Trigger>
          <Tabs.Trigger value="departments" data-testid="staff-tab-departments">Departments</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="users">
          <StaffAccountsTab />
        </Tabs.Content>

        <Tabs.Content value="departments">
          <DepartmentStaffTab />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
