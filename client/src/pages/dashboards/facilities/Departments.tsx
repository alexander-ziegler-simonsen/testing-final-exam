import { useEffect, useState } from "react";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../../components/dashboards/DataTable";
import { CommandFormPopup, type FieldConfig } from "../../../components/dashboards/CommandFormPopup";
import type { DepartmentRequest } from "../../../api/Requests/DepartmentRequest";
import type { DepartmentResponse } from "../../../api/Responses/DepartmentResponse";
import { DepartmentService } from "../../../api/Services/Department";
import { useCommandPopup } from "../../../hooks/useCommandPopup";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
// types for dataTable
type DepartmentRow = DepartmentResponse & { actions?: undefined };

// popup fieldConfig
const departmentFields: FieldConfig<DepartmentRequest>[] = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "type", label: "Type", type: "text", required: true },
];

export default function Departments() {
    // states
    const [data, setData] = useState<DepartmentResponse[]>([]);
    const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, selected: selectedDepartment, openCreate, openEdit, openDelete } =
        useCommandPopup<DepartmentResponse>();

    const loadDepartments = () => {
        DepartmentService.getAll()
            .then(setData)
            .catch((error) => console.error(error));
    };

    useEffect(() => { loadDepartments(); }, []);

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

            <CommandFormPopup<DepartmentRequest> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Department" fields={departmentFields} itemId={selectedDepartment?.id} initialValues={selectedDepartment ?? undefined} service={DepartmentService} onSuccess={loadDepartments} testId="departments-form" />
        </>
    );
}
