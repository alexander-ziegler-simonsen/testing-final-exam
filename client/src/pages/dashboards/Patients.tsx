import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type { HospitalApiDtosOutputsPatientOutputDto } from "../../api";
import { PatientService } from "../../services/Patient";

export default function Patients() {
  const navigate = useNavigate();
  const [data, setData] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);

  useEffect(() => {
    PatientService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  const columns: ColumnConfig<HospitalApiDtosOutputsPatientOutputDto>[] = [
    {
      key: "id",
      header: "Id",
      enableSearch: true,
    },
    {
      key: "firstname",
      header: "First name",
      enableSearch: true,
    },
    {
      key: "lastname",
      header: "Last name",
      enableSearch: true,
    },
    {
      key: "gender",
      header: "Gender",
      enableSearch: true,
    },
    {
      key: "cprNumber",
      header: "CPR Number",
      enableSearch: true,
    },
  ];

  return (
    <>
      <Text data-testid="patients-page-heading" fontSize="xl" fontWeight="bold" mb="4">Patients</Text>
      <DataTable
        testId="patients-table"
        data={data}
        columns={columns}
        pageSize={10}
        onRowClick={(patient) => navigate(`/app/patients/${patient.id}`)}
      />
    </>
  );
}
