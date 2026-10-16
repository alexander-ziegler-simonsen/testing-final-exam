import { useEffect, useState } from "react";
import { HStack, Text } from "@chakra-ui/react";
import type { HospitalApiDtosOutputsPatientOutputDto } from "../../../api";
import { useNavigate } from "react-router";
import { PatientService } from "../../../services/patients/Patient";
import type { ColumnConfig } from "../../../hooks/useDataTable";
import { DataTable } from "../DataTable";

const columns: ColumnConfig<HospitalApiDtosOutputsPatientOutputDto>[] = [
  { key: "id", header: "Id", enableSearch: true, },
  { key: "firstname", header: "First name", enableSearch: true, },
  { key: "lastname", header: "Last name", enableSearch: true, },
  { key: "gender", header: "Gender", enableSearch: true, },
  { key: "cprNumber", header: "CPR Number", enableSearch: true, },
  { key: "dateOfBirth", header: "Date of Birth", enableSearch: true, },
  { key: "weightKg", header: "Weight (kg)", },
  { key: "heightCm", header: "Height (cm)", },
];

// Edit and delete live on the patient's own page (OnePatientPage).
export default function PatientsTab() {
  const navigate = useNavigate();
  const [data, setData] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);

  useEffect(() => {
    PatientService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <HStack justify="space-between" mb="4">
        <Text data-testid="patients-page-heading" fontSize="xl" fontWeight="bold">Patients</Text>
      </HStack>

      <DataTable<HospitalApiDtosOutputsPatientOutputDto> testId="patients-table" data={data} columns={columns} pageSize={10} onRowClick={(patient) => navigate(`/app/patients/${patient.id}`)} />
    </>
  );
}
