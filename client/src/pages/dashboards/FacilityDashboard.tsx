import { Tabs, Text } from "@chakra-ui/react";
import { useSearchParams } from "react-router";
import FacilitiesTab from "../../components/dashboards/facilities/FacilitiesTab";
import DepartmentsTab from "../../components/dashboards/facilities/DepartmentsTab";

export default function FacilityDashboard() {
    // The active tab lives in the URL (/app/facilities?tab=departments), so sub
    // pages can link back to a specific tab.
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") === "departments" ? "departments" : "facilities";

    return (
        <>
            <Text data-testid="placeholderText">FacilityDashboard</Text>
            <Text data-testid="facilities-page-heading" fontSize="xl" fontWeight="bold" mb="4">Facilitiy Dashboard</Text>
            <Tabs.Root value={activeTab} onValueChange={(e) => setSearchParams({ tab: e.value }, { replace: true })} data-testid="facilities-tabs">
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
