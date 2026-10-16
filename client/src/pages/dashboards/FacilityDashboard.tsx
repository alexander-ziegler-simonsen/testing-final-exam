import { useEffect, useState } from "react";
import { Button, HStack, IconButton, Tabs, Text } from "@chakra-ui/react";
import { LocationService } from "../../services/Location";
import type { HospitalApiDtosInputsDepartmentInputDto, HospitalApiDtosOutputsDepartmentOutputDto, HospitalApiDtosOutputsLocationOutputDto } from "../../api";
import { useNavigate } from "react-router";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { useCommandPopup } from "../../hooks/useCommandPopup";
import { DepartmentService } from "../../services/Department";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { CommandFormPopup, type FieldConfig } from "../../components/dashboards/CommandFormPopup";

// department
// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
// types for dataTable
type DepartmentRow = HospitalApiDtosOutputsDepartmentOutputDto & { actions?: undefined };

// popup fieldConfig
const departmentFields: FieldConfig<HospitalApiDtosInputsDepartmentInputDto>[] = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "type", label: "Type", type: "text", required: true },
];


// facilities
interface BuildingRow {
    id?: number;
    name?: string;
    address?: string | null;
}

export default function FacilityDashboard() {
    // department
    const columns1: ColumnConfig<DepartmentRow>[] = [
        { key: "id", header: "Id" },
        { key: "name", header: "Name", enableSearch: true },
        { key: "type", header: "Type", enableSearch: true },
        {
            key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
                <HStack gap="2">
                    <IconButton aria-label="Edit department" size="sm" variant="ghost" data-testid={`departments-edit-${item.id}`} onClick={(e) => {
                        e.stopPropagation();
                        openEdit(item);
                    }}><LuPencil /></IconButton>
                    <IconButton aria-label="Delete department" size="sm" variant="ghost" colorPalette="red" data-testid={`departments-delete-${item.id}`} onClick={(e) => { e.stopPropagation(); openDelete(item); }}><LuTrash2 /></IconButton>
                </HStack>
            ),
        },
    ];

    const [data, setData] = useState<HospitalApiDtosOutputsDepartmentOutputDto[]>([]);
    const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, selected: selectedDepartment, openCreate, openEdit, openDelete } =
        useCommandPopup<HospitalApiDtosOutputsDepartmentOutputDto>();

    const loadDepartments = () => {
        DepartmentService.getAll()
            .then(setData)
            .catch((error) => console.error(error));
    };

    useEffect(() => { loadDepartments(); }, []);



    // facilities
    const navigate = useNavigate();
    const [locations, setLocations] = useState<HospitalApiDtosOutputsLocationOutputDto[]>([]);

    useEffect(() => {
        LocationService.getAll()
            .then(setLocations)
            .catch((error) => console.error(error));
    }, []);

    const rows: BuildingRow[] = locations.map((l) => ({
        id: l.building.id,
        name: l.building.name,
        address: l.building.address,
    }));

    const columns2: ColumnConfig<BuildingRow>[] = [
        { key: "id", header: "Id" },
        { key: "name", header: "Name", enableSearch: true },
        { key: "address", header: "Address", enableSearch: true },
    ];


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
                    <DataTable<BuildingRow> testId="facilities-table" data={rows} columns={columns2} pageSize={10} onRowClick={(item) => navigate(`/app/facilities/${item.id}`)} />
                </Tabs.Content>

                <Tabs.Content value="departments">
                    <HStack justify="space-between" mb="4">
                        <Text data-testid="departments-page-heading" fontSize="xl" fontWeight="bold">Departments</Text>
                        <Button data-testid="departments-add-button" onClick={openCreate}><LuPlus /> Add Department</Button>
                    </HStack>

                    <DataTable<DepartmentRow> testId="departments-table" data={data} columns={columns1} pageSize={10} />

                    <CommandFormPopup<HospitalApiDtosInputsDepartmentInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Department" fields={departmentFields} itemId={selectedDepartment?.id} initialValues={selectedDepartment ?? undefined} service={DepartmentService} onSuccess={loadDepartments} testId="departments-form" />
                </Tabs.Content>
            </Tabs.Root>
        </>
    );
}