import { useEffect, useState } from "react";
import { HStack, Table, Text } from "@chakra-ui/react";
import type { HospitalApiDtosOutputsPatientOutputDto } from "../../../api";
import { useNavigate } from "react-router";
import { PatientService } from "../../../services/patients/Patient";

// Edit lives on the patient's own page (OnePatientPage).
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

      <Table.Root interactive data-testid="patients-table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Id</Table.ColumnHeader>
            <Table.ColumnHeader>First name</Table.ColumnHeader>
            <Table.ColumnHeader>Last name</Table.ColumnHeader>
            <Table.ColumnHeader>Gender</Table.ColumnHeader>
            <Table.ColumnHeader>CPR Number</Table.ColumnHeader>
            <Table.ColumnHeader>Date of Birth</Table.ColumnHeader>
            <Table.ColumnHeader>Weight (kg)</Table.ColumnHeader>
            <Table.ColumnHeader>Height (cm)</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((patient, index) => (
            <Table.Row key={patient.id} data-testid={`patients-table-row-${index}`} cursor="pointer" onClick={() => navigate(`/app/patients/${patient.id}`)}>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-id`}>{patient.id}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-firstname`}>{patient.firstname}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-lastname`}>{patient.lastname}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-gender`}>{patient.gender}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-cprNumber`}>{patient.cprNumber}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-dateOfBirth`}>{patient.dateOfBirth}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-weightKg`}>{patient.weightKg}</Table.Cell>
              <Table.Cell data-testid={`patients-table-row-${index}-cell-heightCm`}>{patient.heightCm}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
