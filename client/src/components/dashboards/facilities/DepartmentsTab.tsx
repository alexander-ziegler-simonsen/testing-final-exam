import { useEffect, useState } from "react";
import { Button, HStack, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import type { HospitalApiDtosInputsDepartmentInputDto, HospitalApiDtosOutputsDepartmentOutputDto } from "../../../api";
import { useCommandPopup } from "../../../hooks/useCommandPopup";
import { LuPlus } from "react-icons/lu";
import { CommandFormPopup } from "../CommandFormPopup";
import { DepartmentService } from "../../../services/staff/Department";
import { departmentFields } from "./departmentForm";

// Edit and delete live on the department's own page (OneDepartmentPage).
export default function DepartmentsTab() {
  const navigate = useNavigate();
  const [data, setData] = useState<HospitalApiDtosOutputsDepartmentOutputDto[]>([]);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, openCreate } =
    useCommandPopup<HospitalApiDtosOutputsDepartmentOutputDto>();

  const loadDepartments = () => {
    DepartmentService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  };

  useEffect(() => { loadDepartments(); }, []);

  return (
    <>
      <HStack justify="space-between" mb="4">
        <Text data-testid="departments-page-heading" fontSize="xl" fontWeight="bold">Departments</Text>
        <Button data-testid="departments-add-button" onClick={openCreate}><LuPlus /> Add Department</Button>
      </HStack>

      <Table.Root interactive data-testid="departments-table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Id</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((department, index) => (
            <Table.Row key={department.id} data-testid={`departments-table-row-${index}`} cursor="pointer" onClick={() => navigate(`/app/departments/${department.id}`)}>
              <Table.Cell data-testid={`departments-table-row-${index}-cell-id`}>{department.id}</Table.Cell>
              <Table.Cell data-testid={`departments-table-row-${index}-cell-name`}>{department.name}</Table.Cell>
              <Table.Cell data-testid={`departments-table-row-${index}-cell-type`}>{department.type}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <CommandFormPopup<HospitalApiDtosInputsDepartmentInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Department" fields={departmentFields} service={DepartmentService} onSuccess={loadDepartments} testId="departments-form" />
    </>
  );
}
