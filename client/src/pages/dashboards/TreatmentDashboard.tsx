import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Text } from "@chakra-ui/react";
import type { HospitalApiDtosOutputsTreatmentOutputDto } from "../../api";
import { TreatmentService } from "../../services/patients/Treatment";
import { useAuthStore } from "../../stores/AuthStore";
import type { ColumnConfig } from "../../hooks/useDataTable";
import { DataTable } from "../../components/dashboards/DataTable";

// Landing page for patients (RoleProtectedRoute sends them here).
// Patients only see their own treatments; staff see every treatment.
export default function TreatmentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isPatient = user?.role === "patient";
  const patientId = user?.patientId;
  const [data, setData] = useState<HospitalApiDtosOutputsTreatmentOutputDto[]>([]);

  useEffect(() => {
    // the api treats a missing fkPatientId as "no filter", so never fetch for a patient without an id
    if (isPatient && !patientId) return;

    TreatmentService.getAll(isPatient ? { fkPatientId: patientId ?? undefined } : undefined)
      .then(setData)
      .catch((error) => console.error(error));
  }, [isPatient, patientId]);

  const columns: ColumnConfig<HospitalApiDtosOutputsTreatmentOutputDto>[] = [
    { key: "id", header: "Id" },
    ...(isPatient ? [] : [{ key: "fkPatientId", header: "Patient Id", enableSearch: true } as const]),
    { key: "description", header: "Description", enableSearch: true },
    { key: "time", header: "Time", render: (value) => (value ? new Date(String(value)).toLocaleString() : "") },
  ];

  return (
    <>
      <Text data-testid="treatments-page-heading" fontSize="xl" fontWeight="bold" mb="4">{isPatient ? "My treatments" : "Treatments"}</Text>

      <DataTable<HospitalApiDtosOutputsTreatmentOutputDto> testId="treatments-table" data={data} columns={columns} pageSize={10}
        onRowClick={(treatment) => navigate(`/app/treatment/${treatment.id}`)} />
    </>
  );
}
