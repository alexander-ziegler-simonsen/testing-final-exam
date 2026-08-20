import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type { HospitalApiDtosOutputsDepartmentStaffOutputDto } from "../../api";
import { DepartmentStaffService } from "../../services/DepartmentStaff";

export default function DepartmentStaff() {
  const [data, setData] = useState<HospitalApiDtosOutputsDepartmentStaffOutputDto[]>([]);

  useEffect(() => {
    DepartmentStaffService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

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

  return (
    <>
      <Text data-testid="department-staff-page-heading" fontSize="xl" fontWeight="bold" mb="4">Department Staff</Text>
      <DataTable testId="department-staff-table" data={data} columns={columns} pageSize={10} />
    </>
  );
}
