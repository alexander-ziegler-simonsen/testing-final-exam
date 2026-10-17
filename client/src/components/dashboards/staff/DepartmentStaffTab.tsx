import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import type { HospitalApiDtosOutputsDepartmentStaffOutputDto } from "../../../api";
import { DataTable, type ColumnConfig } from "../DataTable";
import { DepartmentStaffService } from "../../../services/staff/DepartmentStaff";

const columns: ColumnConfig<HospitalApiDtosOutputsDepartmentStaffOutputDto>[] = [
  { key: "id", header: "Id" },
  { key: "department", header: "Department", sortValue: (item) => item.department?.name, render: (_value, item) => {
      const department = item.department;
      const name = department?.name ?? `Department #${department?.id}`;
      return department?.type ? `${name} (${department.type})` : name;
    },
  },
  { key: "staff", header: "Staff", sortValue: (item) => `${item.staff?.firstname ?? ""} ${item.staff?.lastname ?? ""}`.trim(),
    render: (_value, item) => `${item.staff?.firstname ?? ""} ${item.staff?.lastname ?? ""}`.trim(),
  },
];

export default function DepartmentStaffTab() {
  const [data, setData] = useState<HospitalApiDtosOutputsDepartmentStaffOutputDto[]>([]);

  useEffect(() => {
    DepartmentStaffService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Text data-testid="department-staff-page-heading" fontSize="xl" fontWeight="bold" mb="4">Department Staff</Text>
      <DataTable testId="department-staff-table" data={data} columns={columns} pageSize={10} />
    </>
  );
}
