import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type { HospitalApiDtosOutputsTreatmentOutputDto } from "../../api";
import { TreatmentService } from "../../services/Treatment";

export default function Treatments() {
  const navigate = useNavigate();
  const [data, setData] = useState<HospitalApiDtosOutputsTreatmentOutputDto[]>([]);

  useEffect(() => {
    TreatmentService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  const columns: ColumnConfig<HospitalApiDtosOutputsTreatmentOutputDto>[] = [
    { key: "id", header: "Id" },
    { key: "fkPatientId", header: "Patient Id", enableSearch: true },
    { key: "description", header: "Description", enableSearch: true },
    {
      key: "time",
      header: "Time",
      render: (value) => (value ? new Date(String(value)).toLocaleString() : ""),
    },
  ];

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" mb="4">Treatments</Text>
      <DataTable
        data={data}
        columns={columns}
        pageSize={10}
        onRowClick={(treatment) => navigate(`/app/treatment/${treatment.id}`)}
      />
    </>
  );
}
