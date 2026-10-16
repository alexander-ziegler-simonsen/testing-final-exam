import { useEffect, useState } from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import type { HospitalApiDtosInputsDepartmentInputDto, HospitalApiDtosOutputsDepartmentOutputDto } from "../../../api";
import { DataTable, type ColumnConfig } from "../DataTable";
import { useCommandPopup } from "../../../hooks/useCommandPopup";
import { LuPlus } from "react-icons/lu";
import { CommandFormPopup } from "../CommandFormPopup";
import { DepartmentService } from "../../../services/staff/Department";
import { departmentFields } from "./departmentForm";

const columns: ColumnConfig<HospitalApiDtosOutputsDepartmentOutputDto>[] = [
  { key: "id", header: "Id" },
  { key: "name", header: "Name", enableSearch: true },
  { key: "type", header: "Type", enableSearch: true },
];

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

      <DataTable<HospitalApiDtosOutputsDepartmentOutputDto> testId="departments-table" data={data} columns={columns} pageSize={10} onRowClick={(department) => navigate(`/app/departments/${department.id}`)} />

      <CommandFormPopup<HospitalApiDtosInputsDepartmentInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Department" fields={departmentFields} service={DepartmentService} onSuccess={loadDepartments} testId="departments-form" />
    </>
  );
}
