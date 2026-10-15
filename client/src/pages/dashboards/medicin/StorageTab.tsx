import { useEffect, useState } from "react";
import { Table } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { MedicationStorageService } from "../../../services/MedicationStorage";
import type { HospitalApiDtosOutputsMedicationStorageOutputDto } from "../../../api";

export default function StorageTab() {
  const navigate = useNavigate();
  const [storages, setStorages] = useState<HospitalApiDtosOutputsMedicationStorageOutputDto[]>([]);

  useEffect(() => {
    MedicationStorageService.getAll()
      .then(setStorages)
      .catch((error) => console.error(error));
  }, []);

  return (
    <Table.Root interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Id</Table.ColumnHeader>
          <Table.ColumnHeader>Medication Id</Table.ColumnHeader>
          <Table.ColumnHeader>Amount</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {storages.map((storage) => (
          <Table.Row key={storage.id} cursor="pointer" onClick={() => navigate(`/app/medicin/${storage.id}`)}>
            <Table.Cell>{storage.id}</Table.Cell>
            <Table.Cell>{storage.fkMedicationId}</Table.Cell>
            <Table.Cell>{storage.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
