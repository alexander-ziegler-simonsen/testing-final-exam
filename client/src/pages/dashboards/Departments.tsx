import { useEffect, useState } from "react";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormMode, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type { HospitalApiDtosInputsDepartmentInputDto, HospitalApiDtosOutputsDepartmentOutputDto } from "../../api";
import { DepartmentService } from "../../services/Department";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type DepartmentRow = HospitalApiDtosOutputsDepartmentOutputDto & { actions?: undefined };

const departmentFields: FieldConfig<HospitalApiDtosInputsDepartmentInputDto>[] = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "type", label: "Type", type: "text", required: true },
];

export default function Departments() {
    const [data, setData] = useState<HospitalApiDtosOutputsDepartmentOutputDto[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<CommandFormMode>("create");
    const [selectedDepartment, setSelectedDepartment] = useState<HospitalApiDtosOutputsDepartmentOutputDto | null>(null);

    const loadDepartments = () => {
        DepartmentService.getAll()
            .then(setData)
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const openCreate = () => {
        setSelectedDepartment(null);
        setPopupMode("create");
        setPopupOpen(true);
    };

    const openEdit = (department: HospitalApiDtosOutputsDepartmentOutputDto) => {
        setSelectedDepartment(department);
        setPopupMode("edit");
        setPopupOpen(true);
    };

    const openDelete = (department: HospitalApiDtosOutputsDepartmentOutputDto) => {
        setSelectedDepartment(department);
        setPopupMode("delete");
        setPopupOpen(true);
    };

    const columns: ColumnConfig<DepartmentRow>[] = [
        { key: "id", header: "Id" },
        { key: "name", header: "Name", enableSearch: true },
        { key: "type", header: "Type", enableSearch: true },
        { key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
                <HStack gap="2">
                    <IconButton aria-label="Edit department" size="sm" variant="ghost" data-testid={`departments-edit-${item.id}`} onClick={(e) => {
                            e.stopPropagation();
                            openEdit(item);
                        }}><LuPencil /></IconButton>
                    <IconButton aria-label="Delete department" size="sm" variant="ghost" colorPalette="red" data-testid={`departments-delete-${item.id}`} onClick={(e) => { e.stopPropagation(); openDelete(item);}}><LuTrash2 /></IconButton>
                </HStack>
            ),
        },
    ];

    return (
        <>
            <HStack justify="space-between" mb="4">
                <Text data-testid="departments-page-heading" fontSize="xl" fontWeight="bold">Departments</Text>
                <Button data-testid="departments-add-button" onClick={openCreate}><LuPlus /> Add Department</Button>
            </HStack>

            <DataTable<DepartmentRow> testId="departments-table" data={data} columns={columns} pageSize={10} />

            <CommandFormPopup<HospitalApiDtosInputsDepartmentInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Department" fields={departmentFields} itemId={selectedDepartment?.id} initialValues={selectedDepartment ?? undefined} service={DepartmentService} onSuccess={loadDepartments} testId="departments-form" />
        </>
    );
}
