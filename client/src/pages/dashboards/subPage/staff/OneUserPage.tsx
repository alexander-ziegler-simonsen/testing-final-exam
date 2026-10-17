import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuKeyRound, LuTrash2 } from "react-icons/lu";
import type { HospitalApiDtosInputsRegisterInputDto, HospitalApiDtosOutputsPatientOutputDto, HospitalApiDtosOutputsStaffOutputDto, HospitalApiDtosOutputsUserOutputDto } from "../../../../api";
import { UserService } from "../../../../services/auth/User";
import { StaffService } from "../../../../services/staff/Staff";
import { PatientService } from "../../../../services/patients/Patient";
import { CommandFormPopup, type CommandFormService, type FieldConfig } from "../../../../components/dashboards/CommandFormPopup";
import { useCommandPopup } from "../../../../hooks/useCommandPopup";

// "Edit" on a user account only ever changes the password - the API has no
// endpoint to rename a username or re-point fkStaffId/fkPatientId.
const userFormService: CommandFormService<HospitalApiDtosInputsRegisterInputDto> = {
  update: (id, values) => UserService.changePassword(id, String(values.password ?? "")),
  delete: (id) => UserService.delete(id),
};

export default function OneUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const [user, setUser] = useState<HospitalApiDtosOutputsUserOutputDto | null>(null);
  const [staff, setStaff] = useState<HospitalApiDtosOutputsStaffOutputDto | null>(null);
  const [patient, setPatient] = useState<HospitalApiDtosOutputsPatientOutputDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, openEdit, openDelete } =
    useCommandPopup<HospitalApiDtosOutputsUserOutputDto>();

  // There is no get-by-id endpoint for users, so load them all and pick this one.
  useEffect(() => {
    if (!id) return;
    UserService.getAll()
      .then(async (users) => {
        const match = users.find((u) => u.id === userId) ?? null;
        setUser(match);
        if (match?.fkStaffId) setStaff(await StaffService.getById(match.fkStaffId));
        if (match?.fkPatientId) setPatient(await PatientService.getById(match.fkPatientId));
        setLoaded(true);
      })
      .catch((err) => setError(err.message));
  }, [id, userId]);

  // Edit asks for the new password; delete shows the username being removed.
  const userFields: FieldConfig<HospitalApiDtosInputsRegisterInputDto>[] = useMemo(
    () => (popupMode === "delete"
      ? [{ key: "username", label: "Username", type: "text" }]
      : [{ key: "password", label: "New Password", type: "text", required: true }]),
    [popupMode],
  );

  const backToUsers = () => navigate("/app/staff");

  if (error) return <Text data-testid="one-user-error" color="red.500">{error}</Text>;
  if (!loaded) return <Text data-testid="one-user-loading">Loading user...</Text>;
  if (!user) return <Text data-testid="one-user-not-found">User not found.</Text>;

  return (
    <Stack gap="4" data-testid="one-user-page">
      <Button data-testid="one-user-back-button" alignSelf="start" variant="outline" onClick={backToUsers}>Back to staff accounts</Button>

      <HStack justify="space-between">
        <Heading data-testid="one-user-heading" size="lg">{user.username}</Heading>
        <HStack gap="2">
          <Button data-testid="one-user-edit-button" variant="outline" onClick={() => openEdit(user)}><LuKeyRound /> Change Password</Button>
          <Button data-testid="one-user-delete-button" variant="outline" colorPalette="red" onClick={() => openDelete(user)}><LuTrash2 /> Delete</Button>
        </HStack>
      </HStack>

      <Stack gap="2">
        <Text data-testid="one-user-field-id"><b>Id:</b> {user.id}</Text>
        <Text data-testid="one-user-field-username"><b>Username:</b> {user.username}</Text>
        {staff && (
          <Text data-testid="one-user-field-staff"><b>Staff member:</b> {[staff.firstname, staff.lastname].filter(Boolean).join(" ")}</Text>
        )}
        {patient && (
          <Text data-testid="one-user-field-patient">
            <b>Patient:</b>{" "}
            <Text as="span" color="blue.600" cursor="pointer" onClick={() => navigate(`/app/patients/${patient.id}`)}>{patient.firstname} {patient.lastname}</Text>
          </Text>
        )}
      </Stack>

      <CommandFormPopup<HospitalApiDtosInputsRegisterInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="User" fields={userFields}
        itemId={user.id} initialValues={user} service={userFormService} testId="one-user-form"
        onSuccess={(mode) => { if (mode === "delete") backToUsers(); }} />
    </Stack>
  );
}
