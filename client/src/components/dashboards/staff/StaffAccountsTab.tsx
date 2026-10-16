import { useEffect, useMemo, useState } from "react";
import { Button, HStack, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import type { HospitalApiDtosInputsRegisterInputDto, HospitalApiDtosOutputsPatientOutputDto, HospitalApiDtosOutputsStaffOutputDto, HospitalApiDtosOutputsUserOutputDto } from "../../../api";
import { CommandFormPopup, type CommandFormService, type FieldConfig } from "../CommandFormPopup";
import { LuPlus } from "react-icons/lu";
import { StaffService } from "../../../services/staff/Staff";
import { PatientService } from "../../../services/patients/Patient";
import { UserService } from "../../../services/auth/User";
import { useCommandPopup } from "../../../hooks/useCommandPopup";

// Change password and delete live on the user's own page (OneUserPage).
export default function StaffAccountsTab() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<HospitalApiDtosOutputsUserOutputDto[]>([]);
  const [staff, setStaff] = useState<HospitalApiDtosOutputsStaffOutputDto[]>([]);
  const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, openCreate } =
    useCommandPopup<HospitalApiDtosOutputsUserOutputDto>();

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

  // A user is either a staff login or a patient login - pick one, leave the
  // other blank.
  const userFields: FieldConfig<HospitalApiDtosInputsRegisterInputDto>[] = useMemo(
    () => [
      { key: "username", label: "Username", type: "text", required: true },
      { key: "password", label: "Password", type: "text", required: true },
      { key: "fkStaffId", label: "Staff Member", type: "select", options: staffOptions, placeholder: "— none —" },
      { key: "fkPatientId", label: "Patient", type: "select", options: patientOptions, placeholder: "— none —" },
    ],
    [staffOptions, patientOptions],
  );

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
    }),
    [],
  );

  return (
    <>
      <HStack justify="space-between" mb="4">
        <Text data-testid="staff-page-heading" fontSize="xl" fontWeight="bold">Staff Accounts</Text>
        <Button data-testid="staff-add-button" onClick={openCreate}><LuPlus /> Add User</Button>
      </HStack>

      <Table.Root interactive data-testid="staff-table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Id</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Linked Account</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user, index) => (
            <Table.Row key={user.id} data-testid={`staff-table-row-${index}`} cursor="pointer" onClick={() => navigate(`/app/users/${user.id}`)}>
              <Table.Cell data-testid={`staff-table-row-${index}-cell-id`}>{user.id}</Table.Cell>
              <Table.Cell data-testid={`staff-table-row-${index}-cell-username`}>{user.username}</Table.Cell>
              <Table.Cell data-testid={`staff-table-row-${index}-cell-fkStaffId`}>{linkedAccountLabel(user)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <CommandFormPopup<HospitalApiDtosInputsRegisterInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="User" fields={userFields} service={userFormService} onSuccess={loadUsers} testId="staff-form" />
    </>
  );
}
