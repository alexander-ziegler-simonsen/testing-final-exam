import { Tabs, Text } from "@chakra-ui/react";
import { LuBaby, LuUsers } from "react-icons/lu";
import PatientsTab from "../../components/dashboards/patient/PatientsTab";
import RegisterBabyTab from "../../components/dashboards/patient/RegisterBabyTab";

export default function PatientDashboard() {
  return (
    <>
      <Text data-testid="placeholderText">PatientDashboard</Text>
      <Tabs.Root defaultValue="patients" lazyMount unmountOnExit data-testid="patients-tabs">
        <Tabs.List mb="4">
          <Tabs.Trigger value="patients" data-testid="patients-tab-patients">
            <LuUsers />
            Patients
          </Tabs.Trigger>
          <Tabs.Trigger value="baby" data-testid="patients-tab-baby">
            <LuBaby />
            Register baby
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="patients">
          <PatientsTab />
        </Tabs.Content>

        <Tabs.Content value="baby">
          <RegisterBabyTab />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
