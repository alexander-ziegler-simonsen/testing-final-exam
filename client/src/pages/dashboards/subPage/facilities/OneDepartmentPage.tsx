import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import type { HospitalApiDtosInputsDepartmentInputDto, HospitalApiDtosOutputsDepartmentOutputDto } from "../../../../api";
import { DepartmentService } from "../../../../services/staff/Department";
import { CommandFormPopup } from "../../../../components/dashboards/CommandFormPopup";
import { useCommandPopup } from "../../../../hooks/useCommandPopup";
import { departmentFields } from "../../../../components/dashboards/facilities/departmentForm";

export default function OneDepartmentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const departmentId = Number(id);

    const [department, setDepartment] = useState<HospitalApiDtosOutputsDepartmentOutputDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, openEdit, openDelete } =
        useCommandPopup<HospitalApiDtosOutputsDepartmentOutputDto>();

    const loadDepartment = () => {
        if (!id) return;
        DepartmentService.getById(departmentId)
            .then(setDepartment)
            .catch((err) => setError(err.message));
    };

    useEffect(() => {
        loadDepartment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const backToDepartments = () => navigate("/app/facilities?tab=departments");

    if (error) return <Text data-testid="one-department-error" color="red.500">{error}</Text>;
    if (!department) return <Text data-testid="one-department-loading">Loading department...</Text>;

    return (
        <Stack gap="4" data-testid="one-department-page">
            <Button data-testid="one-department-back-button" alignSelf="start" variant="outline" onClick={backToDepartments}>Back to departments</Button>

            <HStack justify="space-between">
                <Heading data-testid="one-department-heading" size="lg">{department.name}</Heading>
                <HStack gap="2">
                    <Button data-testid="one-department-edit-button" variant="outline" onClick={() => openEdit(department)}><LuPencil /> Edit</Button>
                    <Button data-testid="one-department-delete-button" variant="outline" colorPalette="red" onClick={() => openDelete(department)}><LuTrash2 /> Delete</Button>
                </HStack>
            </HStack>

            <Stack gap="2">
                <Text data-testid="one-department-field-id"><b>Id:</b> {department.id}</Text>
                <Text data-testid="one-department-field-name"><b>Name:</b> {department.name}</Text>
                <Text data-testid="one-department-field-type"><b>Type:</b> {department.type}</Text>
            </Stack>

            <CommandFormPopup<HospitalApiDtosInputsDepartmentInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Department" fields={departmentFields}
                itemId={department.id} initialValues={department} service={DepartmentService} testId="one-department-form"
                onSuccess={(mode) => (mode === "delete" ? backToDepartments() : loadDepartment())} />
        </Stack>
    );
}
