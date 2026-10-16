import { Tabs, Text } from "@chakra-ui/react";
import FacilitiesTab from "../../components/dashboards/facilities/FacilitiesTab";
import DepartmentsTab from "../../components/dashboards/facilities/DepartmentsTab";

export default function FacilityDashboard() {
    return (
        <>
            <Text data-testid="placeholderText">FacilityDashboard</Text>
            <Text data-testid="facilities-page-heading" fontSize="xl" fontWeight="bold" mb="4">Facilitiy Dashboard</Text>
            <Tabs.Root defaultValue="facilities" data-testid="facilities-tabs">
                <Tabs.List mb="4">
                    <Tabs.Trigger value="facilities" data-testid="facilities-tab-facilities">Facilities</Tabs.Trigger>
                    <Tabs.Trigger value="departments" data-testid="facilities-tab-departments">Departments</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="facilities">
                    <FacilitiesTab />
                </Tabs.Content>

                <Tabs.Content value="departments">
                    <DepartmentsTab />
                </Tabs.Content>
            </Tabs.Root>
        </>
    );
}
