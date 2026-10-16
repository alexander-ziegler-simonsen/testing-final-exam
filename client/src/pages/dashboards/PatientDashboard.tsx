import { useEffect, useState } from "react";
import { Button, Field, HStack, IconButton, Input, NativeSelect, Stack, Tabs, Text } from "@chakra-ui/react";
import type { HospitalApiDtosInputsPatientInputDto, HospitalApiDtosOutputsPatientOutputDto } from "../../api";
import { useNavigate } from "react-router";
import { useCommandPopup } from "../../hooks/useCommandPopup";
import { PatientService } from "../../services/Patient";
import type { ColumnConfig } from "../../hooks/useDataTable";
import { LuBaby, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import { toaster } from "../../components/ui/toaster";


// patient table --------
// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type PatientRow = HospitalApiDtosOutputsPatientOutputDto & { actions?: undefined };

const patientFields: FieldConfig<HospitalApiDtosInputsPatientInputDto>[] = [
  { key: "firstname", label: "First name", type: "text", required: true, lockedOnEdit: true },
  { key: "lastname", label: "Last name", type: "text", required: true, lockedOnEdit: true },
  {
    key: "gender", label: "Gender", type: "select", required: true, lockedOnEdit: true,
    options: [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" },],
  },
  { key: "cprNumber", label: "CPR Number", type: "text", required: true, lockedOnEdit: true },
  { key: "dateOfBirth", label: "Date of birth", type: "date", lockedOnEdit: true },
  { key: "weightKg", label: "Weight (kg)", type: "number" },
  { key: "heightCm", label: "Height (cm)", type: "number" },
];

export default function PatientDashboard() {
  // baby tab -------

  const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState<"male" | "female" | "">("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [submitting, setSubmitting] = useState(false);
  
    const canSubmit = !submitting && firstname.trim() && lastname.trim() && gender && dateOfBirth;
  
    const handleSubmit = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!canSubmit) return;
  
      setSubmitting(true);
      try {
        await PatientService.registerBaby({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          gender,
          dateOfBirth,
        });
  
        toaster.create({ type: "success", title: "Baby registered", description: "A new patient record was created." });
  
        setFirstname("");
        setLastname("");
        setGender("");
        setDateOfBirth("");
      } catch (error: any) {
        toaster.create({ type: "error", title: "Failed to register baby", description: error?.message ?? "Something went wrong." });
      } finally {
        setSubmitting(false);
      }
    };


  // patient table --------
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
    {
      key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
        <HStack gap="2">
          <IconButton aria-label="Edit patient" size="sm" variant="ghost" data-testid={`patients-edit-${item.id}`} onClick={(e) => {
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
      <Text data-testid="placeholderText">PatientDashboard</Text>

      <Tabs.Root
        lazyMount
        unmountOnExit
      >
        <Tabs.List>
          <Tabs.Trigger value="patients">
            <LuPlus />
            Patients
          </Tabs.Trigger>
          <Tabs.Trigger value="baby">
            <LuBaby />
            Register baby
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="patients">
          <HStack justify="space-between" mb="4">
            <Text data-testid="patients-page-heading" fontSize="xl" fontWeight="bold">Patients</Text>
            <Button data-testid="patients-add-button" onClick={openCreate}><LuPlus /> Add Patient</Button>
          </HStack>

          <DataTable<PatientRow> testId="patients-table" data={data} columns={columns} pageSize={10} onRowClick={(patient) => navigate(`/app/patients/${patient.id}`)} />

          <CommandFormPopup<HospitalApiDtosInputsPatientInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Patient" fields={patientFields}
            itemId={selectedPatient?.id} initialValues={selectedPatient ?? undefined} service={PatientService} onSuccess={loadPatients} testId="patients-form" />
        </Tabs.Content>
        <Tabs.Content value="baby">
          
            <Text data-testid="baby-page-heading" fontSize="xl" fontWeight="bold">Register Baby</Text>

<Stack gap="4" data-testid="register-baby-page" maxW="md">
      <Text data-testid="register-baby-page-heading" fontSize="xl" fontWeight="bold">Register Baby</Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <Field.Root required>
            <Field.Label>First name<Field.RequiredIndicator /></Field.Label>
            <Input data-testid="register-baby-field-firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Last name<Field.RequiredIndicator /></Field.Label>
            <Input data-testid="register-baby-field-lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Gender<Field.RequiredIndicator /></Field.Label>
            <NativeSelect.Root size="sm" width="full">
              <NativeSelect.Field data-testid="register-baby-field-gender" value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "")}>
                <option value="" disabled>Select gender…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root required>
            <Field.Label>Date of birth<Field.RequiredIndicator /></Field.Label>
            <Input data-testid="register-baby-field-date-of-birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </Field.Root>

          <Button type="submit" colorPalette="blue" alignSelf="start" data-testid="register-baby-submit-button" loading={submitting} disabled={!canSubmit}>Register Baby</Button>
        </Stack>
      </form>
    </Stack>

        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
