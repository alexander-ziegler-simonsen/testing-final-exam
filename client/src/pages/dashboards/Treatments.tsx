import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormMode, type CommandFormService, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type { HospitalApiDtosInputsTreatmentInputDto, HospitalApiDtosOutputsPatientOutputDto, HospitalApiDtosOutputsTreatmentOutputDto } from "../../api";
import { TreatmentService } from "../../services/Treatment";
import { PatientService } from "../../services/Patient";
import { useAuthStore } from "../../stores/AuthStore";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type TreatmentRow = HospitalApiDtosOutputsTreatmentOutputDto & { actions?: undefined };

// datetime-local inputs need "YYYY-MM-DDTHH:mm", not a full ISO string.
const toDatetimeLocal = (value?: string | null) => (value ? value.slice(0, 16) : "");

// The API's zod schema requires a full ISO datetime (seconds + timezone),
// but datetime-local inputs only produce "YYYY-MM-DDTHH:mm".
const fromDatetimeLocal = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export default function Treatments() {
  const navigate = useNavigate();
  const staffId = useAuthStore((state) => state.user?.staffId);
  const [data, setData] = useState<HospitalApiDtosOutputsTreatmentOutputDto[]>([]);
  const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<CommandFormMode>("create");
  const [selectedTreatment, setSelectedTreatment] = useState<HospitalApiDtosOutputsTreatmentOutputDto | null>(null);

  const loadTreatments = () => {
    TreatmentService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadTreatments();
    PatientService.getAll()
      .then(setPatients)
      .catch((error) => console.error(error));
  }, []);

  const openCreate = () => {
    setSelectedTreatment(null);
    setPopupMode("create");
    setPopupOpen(true);
  };

  const openEdit = (treatment: HospitalApiDtosOutputsTreatmentOutputDto) => {
    setSelectedTreatment(treatment);
    setPopupMode("edit");
    setPopupOpen(true);
  };

  const openDelete = (treatment: HospitalApiDtosOutputsTreatmentOutputDto) => {
    setSelectedTreatment(treatment);
    setPopupMode("delete");
    setPopupOpen(true);
  };

  const treatmentFields: FieldConfig<HospitalApiDtosInputsTreatmentInputDto>[] = useMemo(
    () => [
      { key: "fkPatientId", label: "Patient", type: "select", required: true,
        options: patients.map((patient) => ({ label: [patient.firstname, patient.lastname].filter(Boolean).join(" "), value: patient.id ?? 0, })),
      },
      { key: "description", label: "Description", type: "text" },
      { key: "time", label: "Time", type: "datetime", required: true },
    ],
    [patients],
  );

  // Wraps TreatmentService so creating a treatment also attributes it to the
  // logged-in staff member, in the same call that creates the treatment.
  const treatmentFormService: CommandFormService<HospitalApiDtosInputsTreatmentInputDto> = useMemo(
    () => ({
      create: (values) => TreatmentService.create({ ...values, time: fromDatetimeLocal(values.time) }, staffId),
      update: (id, values) => TreatmentService.update(id, { ...values, time: fromDatetimeLocal(values.time) }),
      delete: (id) => TreatmentService.delete(id),
    }),
    [staffId],
  );

  const columns: ColumnConfig<TreatmentRow>[] = [
    { key: "id", header: "Id" },
    { key: "fkPatientId", header: "Patient Id", enableSearch: true },
    { key: "description", header: "Description", enableSearch: true },
    { key: "time", header: "Time", render: (value) => (value ? new Date(String(value)).toLocaleString() : ""), },
    {
      key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
        <HStack gap="2">
          <IconButton aria-label="Edit treatment" size="sm" variant="ghost" data-testid={`treatments-edit-${item.id}`} onClick={(e) => {
              e.stopPropagation();
              openEdit(item);
            }}><LuPencil /></IconButton>
          <IconButton aria-label="Delete treatment" size="sm" variant="ghost"colorPalette="red" data-testid={`treatments-delete-${item.id}`} onClick={(e) => {
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
        <Text data-testid="treatments-page-heading" fontSize="xl" fontWeight="bold">Treatments</Text>
        <Button data-testid="treatments-add-button" onClick={openCreate}><LuPlus /> Add Treatment</Button>
      </HStack>

      <DataTable<TreatmentRow> testId="treatments-table" data={data} columns={columns} pageSize={10} onRowClick={(treatment) => navigate(`/app/treatment/${treatment.id}`)} />

      <CommandFormPopup<HospitalApiDtosInputsTreatmentInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Treatment"
        fields={treatmentFields} itemId={selectedTreatment?.id} service={treatmentFormService} onSuccess={loadTreatments} testId="treatments-form"
        initialValues={ selectedTreatment ? { ...selectedTreatment, time: toDatetimeLocal(selectedTreatment.time) } : undefined } />
    </>
  );
}
