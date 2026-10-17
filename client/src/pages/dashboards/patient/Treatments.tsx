import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormService, type FieldConfig } from "../../../components/dashboards/CommandFormPopup";
import type { TreatmentRequest } from "../../../api/Requests/TreatmentRequest";
import type { PatientResponse } from "../../../api/Responses/PatientResponse";
import type { TreatmentResponse } from "../../../api/Responses/TreatmentResponse";
import { TreatmentService } from "../../../api/Services/Treatment";
import { useAuthStore } from "../../../stores/AuthStore";
import { useCommandPopup } from "../../../hooks/useCommandPopup";
import { PatientService } from "../../../api/Services/Patient";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type TreatmentRow = TreatmentResponse & { actions?: undefined };

// The popup's datetime-local input holds the time as a "YYYY-MM-DDTHH:mm" string, not a Date.
type TreatmentForm = Omit<TreatmentRequest, "time"> & { time: string };

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, not a full (UTC) ISO string.
const toDatetimeLocal = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

export default function Treatments() {
  const navigate = useNavigate();
  const staffId = useAuthStore((state) => state.user?.staffId);
  const [data, setData] = useState<TreatmentResponse[]>([]);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, selected: selectedTreatment, openCreate, openEdit, openDelete } =
    useCommandPopup<TreatmentResponse>();

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

  const treatmentFields: FieldConfig<TreatmentForm>[] = useMemo(
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
  // new Date() reads the datetime-local value as local time.
  const treatmentFormService: CommandFormService<TreatmentForm> = useMemo(
    () => ({
      create: (values) => TreatmentService.create({ ...values, time: new Date(values.time) }, staffId),
      update: (id, values) => TreatmentService.update(id, { ...values, time: new Date(values.time) }),
      delete: (id) => TreatmentService.delete(id),
    }),
    [staffId],
  );

  const columns: ColumnConfig<TreatmentRow>[] = [
    { key: "id", header: "Id" },
    { key: "fkPatientId", header: "Patient Id", enableSearch: true },
    { key: "description", header: "Description", enableSearch: true },
    { key: "time", header: "Time", render: (_value, item) => item.time.toLocaleString(), },
    { key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
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

      <CommandFormPopup<TreatmentForm> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Treatment"
        fields={treatmentFields} itemId={selectedTreatment?.id} service={treatmentFormService} onSuccess={loadTreatments} testId="treatments-form"
        initialValues={ selectedTreatment ? { ...selectedTreatment, time: toDatetimeLocal(selectedTreatment.time) } : undefined } />
    </>
  );
}
