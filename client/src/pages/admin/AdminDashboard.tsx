import { Box, Heading, Tabs } from "@chakra-ui/react"
import MedicationStoragePage from "../MedicationStoragePage"
import StaffManagement from "../../components/StaffManagement"
import DepartmentManagement from "../../components/DepartmentManagement"
import ShiftManagement from "../../components/ShiftManagement"
import MedicationManagement from "../../components/MedicationManagement"
import PrescriptionManagement from "../../components/PrescriptionManagement"
import TreatmentStaffManagement from "../../components/TreatmentStaffManagement"
import UserManagement from "../../components/UserManagement"

export default function AdminDashboard() {
    return (
        <Box p={8}>
            <Heading mb={6}>Admin Dashboard</Heading>
            
            <Tabs.Root defaultValue="staff">
                {/* header tabs */}
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="staff">Staff</Tabs.Trigger>
                    <Tabs.Trigger value="departments">Departments</Tabs.Trigger>
                    <Tabs.Trigger value="shifts">Shifts</Tabs.Trigger>
                    <Tabs.Trigger value="medications">Medications</Tabs.Trigger>
                    <Tabs.Trigger value="prescriptions">Prescriptions</Tabs.Trigger>
                    <Tabs.Trigger value="treatment-staff">Treatment Staff</Tabs.Trigger>
                    <Tabs.Trigger value="users">Users</Tabs.Trigger>
                    <Tabs.Trigger value="medication-storage">Medication Storage</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="staff">
                    <StaffManagement />
                </Tabs.Content>

                <Tabs.Content value="departments">
                    <DepartmentManagement />
                </Tabs.Content>

                <Tabs.Content value="shifts">
                    <ShiftManagement />
                </Tabs.Content>

                <Tabs.Content value="medications">
                    <MedicationManagement />
                </Tabs.Content>

                <Tabs.Content value="prescriptions">
                    <PrescriptionManagement />
                </Tabs.Content>

                <Tabs.Content value="treatment-staff">
                    <TreatmentStaffManagement />
                </Tabs.Content>

                <Tabs.Content value="users">
                    <UserManagement />
                </Tabs.Content>

                <Tabs.Content value="medication-storage">
                    <MedicationStoragePage />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}
