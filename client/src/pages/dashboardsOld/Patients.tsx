import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type { HospitalApiDtosInputsPatientInputDto, HospitalApiDtosOutputsPatientOutputDto } from "../../api";
import { PatientService } from "../../services/Patient";
import { useCommandPopup } from "../../hooks/useCommandPopup";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type PatientRow = HospitalApiDtosOutputsPatientOutputDto & { actions?: undefined };

const patientFields: FieldConfig<HospitalApiDtosInputsPatientInputDto>[] = [
  { key: "firstname", label: "First name", type: "text", required: true, lockedOnEdit: true },
  { key: "lastname", label: "Last name", type: "text", required: true, lockedOnEdit: true },
  { key: "gender", label: "Gender", type: "select", required: true, lockedOnEdit: true,
    options: [ { label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" },],
  },
  { key: "cprNumber", label: "CPR Number", type: "text", required: true, lockedOnEdit: true },
  { key: "dateOfBirth", label: "Date of birth", type: "date", lockedOnEdit: true },
  { key: "weightKg", label: "Weight (kg)", type: "number" },
  { key: "heightCm", label: "Height (cm)", type: "number" },
];

export default function Patients() {
  const navigate = useNavigate();
  const [data, setData] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, selected: selectedPatient, openCreate, openEdit, openDelete } =
    useCommandPopup<HospitalApiDtosOutputsPatientOutputDto>();

  const loadPatients = () => {
    PatientService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const columns: ColumnConfig<PatientRow>[] = [
    { key: "id", header: "Id", enableSearch: true, },
    { key: "firstname", header: "First name", enableSearch: true, },
    { key: "lastname", header: "Last name", enableSearch: true, },
    { key: "gender", header: "Gender", enableSearch: true, },
    { key: "cprNumber", header: "CPR Number", enableSearch: true, },
    { key: "dateOfBirth", header: "Date of Birth", enableSearch: true, },
    { key: "weightKg", header: "Weight (kg)", },
    { key: "heightCm", header: "Height (cm)", },
    { key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
        <HStack gap="2">
          <IconButton aria-label="Edit patient" size="sm"variant="ghost" data-testid={`patients-edit-${item.id}`} onClick={(e) => {
              e.stopPropagation();
              openEdit(item);
            }}><LuPencil /></IconButton>
          <IconButton data-testid={`patients-delete-${item.id}`} aria-label="Delete patient" size="sm" variant="ghost" colorPalette="red"
            onClick={(e) => {
              e.stopPropagation();
              openDelete(item);
            }}><LuTrash2 /></IconButton>
        </HStack>
      ),
    },
  ];

  return (
    <>
      <HStack justify="space-between" mb="4">
        <Text data-testid="patients-page-heading" fontSize="xl" fontWeight="bold">Patients</Text>
        <Button data-testid="patients-add-button" onClick={openCreate}><LuPlus /> Add Patient</Button>
      </HStack>

      <DataTable<PatientRow> testId="patients-table" data={data} columns={columns} pageSize={10} onRowClick={(patient) => navigate(`/app/patients/${patient.id}`)} />

      <CommandFormPopup<HospitalApiDtosInputsPatientInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Patient" fields={patientFields}
        itemId={selectedPatient?.id} initialValues={selectedPatient ?? undefined} service={PatientService} onSuccess={loadPatients} testId="patients-form" />
    </>
  );
}
