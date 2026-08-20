import { useEffect, useMemo, useState } from "react";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuKeyRound, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormMode, type CommandFormService, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type {
  HospitalApiDtosInputsRegisterInputDto,
  HospitalApiDtosOutputsPatientOutputDto,
  HospitalApiDtosOutputsStaffOutputDto,
  HospitalApiDtosOutputsUserOutputDto,
} from "../../api";
import { UserService } from "../../services/User";
import { StaffService } from "../../services/Staff";
import { PatientService } from "../../services/Patient";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type UserRow = HospitalApiDtosOutputsUserOutputDto & { actions?: undefined };

export default function Staff() {
  const [users, setUsers] = useState<HospitalApiDtosOutputsUserOutputDto[]>([]);
  const [staff, setStaff] = useState<HospitalApiDtosOutputsStaffOutputDto[]>([]);
  const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<CommandFormMode>("create");
  const [selectedUser, setSelectedUser] = useState<HospitalApiDtosOutputsUserOutputDto | null>(null);

  const loadUsers = () => {
    UserService.getAll()
      .then(setUsers)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadUsers();
    StaffService.getAll()
      .then(setStaff)
      .catch((error) => console.error(error));
    PatientService.getAll()
      .then(setPatients)
      .catch((error) => console.error(error));
  }, []);

  const staffName = (staffId?: number | null) => {
    const match = staff.find((s) => s.id === staffId);
    if (match) return [match.firstname, match.lastname].filter(Boolean).join(" ");
    return staffId ? `#${staffId}` : "";
  };

  const patientName = (patientId?: number | null) => {
    const match = patients.find((p) => p.id === patientId);
    if (match) return [match.firstname, match.lastname].filter(Boolean).join(" ");
    return patientId ? `#${patientId}` : "";
  };

  // Every user is linked to exactly one of a staff member or a patient.
  const linkedAccountLabel = (item: HospitalApiDtosOutputsUserOutputDto) => {
    if (item.fkStaffId) return staffName(item.fkStaffId);
    if (item.fkPatientId) return `Patient: ${patientName(item.fkPatientId)}`;
    return "—";
  };

  const openCreate = () => {
    setSelectedUser(null);
    setPopupMode("create");
    setPopupOpen(true);
  };

  const openEdit = (user: HospitalApiDtosOutputsUserOutputDto) => {
    setSelectedUser(user);
    setPopupMode("edit");
    setPopupOpen(true);
  };

  const openDelete = (user: HospitalApiDtosOutputsUserOutputDto) => {
    setSelectedUser(user);
    setPopupMode("delete");
    setPopupOpen(true);
  };

  const staffOptions = useMemo(
    () =>
      staff.map((s) => ({
        label: [s.firstname, s.lastname].filter(Boolean).join(" ") || `Staff #${s.id}`,
        value: s.id ?? 0,
      })),
    [staff],
  );

  const patientOptions = useMemo(
    () =>
      patients.map((p) => ({
        label: [p.firstname, p.lastname].filter(Boolean).join(" ") || `Patient #${p.id}`,
        value: p.id ?? 0,
      })),
    [patients],
  );

  // "Edit" on a user account only ever changes the password - the API has no
  // endpoint to rename a username or re-point fkStaffId/fkPatientId - so the
  // field list is mode-dependent instead of shared between create and edit.
  // A user is either a staff login or a patient login - pick one, leave the
  // other blank.
  const userFields: FieldConfig<HospitalApiDtosInputsRegisterInputDto>[] = useMemo(() => {
    if (popupMode === "edit") {
      return [{ key: "password", label: "New Password", type: "text", required: true }];
    }
    return [
      { key: "username", label: "Username", type: "text", required: true },
      { key: "password", label: "Password", type: "text", required: true },
      { key: "fkStaffId", label: "Staff Member", type: "select", options: staffOptions, placeholder: "— none —" },
      { key: "fkPatientId", label: "Patient", type: "select", options: patientOptions, placeholder: "— none —" },
    ];
  }, [popupMode, staffOptions, patientOptions]);

  const userFormService: CommandFormService<HospitalApiDtosInputsRegisterInputDto> = useMemo(
    () => ({
      create: (values) => {
        const hasStaff = values.fkStaffId !== undefined && values.fkStaffId !== null;
        const hasPatient = values.fkPatientId !== undefined && values.fkPatientId !== null;
        if (hasStaff === hasPatient) {
          return Promise.reject(new Error("Pick exactly one of Staff Member or Patient."));
        }
        return UserService.register({
          ...values,
          // fkStaffId defaults to a staff id when left unset, so a patient
          // login needs it explicitly nulled out rather than left blank.
          fkStaffId: hasStaff ? values.fkStaffId : null,
          fkPatientId: hasPatient ? values.fkPatientId : undefined,
        });
      },
      update: (id, values) => UserService.changePassword(id, String(values.password ?? "")),
      delete: (id) => UserService.delete(id),
    }),
    [],
  );

  const columns: ColumnConfig<UserRow>[] = [
    { key: "id", header: "Id" },
    { key: "username", header: "Username", enableSearch: true },
    { key: "fkStaffId", header: "Linked Account", enableSearch: true, sortValue: (item) => linkedAccountLabel(item), render: (_value, item) => linkedAccountLabel(item), },
    { key: "actions", header: "Actions", enableSort: false, render: (_value, item) => (
        <HStack gap="2">
          <IconButton aria-label="Change password" size="sm" variant="ghost" onClick={(e) => {
              e.stopPropagation();
              openEdit(item);
            }} data-testid={`staff-edit-${item.id}`}><LuKeyRound /></IconButton>

          <IconButton aria-label="Delete user" size="sm" variant="ghost" colorPalette="red" onClick={(e) => {
              e.stopPropagation();
              openDelete(item);
            }}
            data-testid={`staff-delete-${item.id}`}><LuTrash2 /></IconButton>
        </HStack>
      ),
    },
  ];

  return (
    <>
      <HStack justify="space-between" mb="4">
        <Text data-testid="staff-page-heading" fontSize="xl" fontWeight="bold">Staff Accounts</Text>
        <Button data-testid="staff-add-button" onClick={openCreate}><LuPlus /> Add User</Button>
      </HStack>

      <DataTable<UserRow> testId="staff-table" data={users} columns={columns} pageSize={10} />

      <CommandFormPopup<HospitalApiDtosInputsRegisterInputDto>open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="User" fields={userFields} itemId={selectedUser?.id} initialValues={selectedUser ?? undefined} service={userFormService} onSuccess={loadUsers} testId="staff-form" />
    </>
  );
}
