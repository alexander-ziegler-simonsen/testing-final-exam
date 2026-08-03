import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import type { HospitalApiDtosOutputsPatientOutputDto } from "../../api";
import { PatientService } from "../../services/Patient";

export default function OnePatient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<HospitalApiDtosOutputsPatientOutputDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    PatientService.getById(Number(id))
      .then(setPatient)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <Text color="red.500">{error}</Text>;
  if (!patient) return <Text>Loading patient...</Text>;

  return (
    <Stack gap="4">
      <Button alignSelf="start" variant="outline" onClick={() => navigate("/app/patients")}>
        Back to patients
      </Button>

      <Heading size="lg">{patient.firstname} {patient.lastname}</Heading>

      <Stack gap="2">
        <Text><b>Id:</b> {patient.id}</Text>
        <Text><b>First name:</b> {patient.firstname}</Text>
        <Text><b>Last name:</b> {patient.lastname}</Text>
        <Text><b>Gender:</b> {patient.gender}</Text>
        <Text><b>CPR Number:</b> {patient.cprNumber}</Text>
      </Stack>
    </Stack>
  );
}
