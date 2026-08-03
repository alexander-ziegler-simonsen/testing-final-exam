import { Badge, Code, Input, Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type { HospitalApiDtosOutputsMedicationStorageMissingOutputDto } from "../../api";
import { MedicationStorageMissingService } from "../../services/MedicationStorageMissing";
import { useEffect, useState } from "react";

export default function MissingMedicin() {

  const [data, setData] = useState<HospitalApiDtosOutputsMedicationStorageMissingOutputDto[]>([]);

  useEffect(() => {
    MedicationStorageMissingService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  const columns: ColumnConfig<HospitalApiDtosOutputsMedicationStorageMissingOutputDto>[] = [
    {
      key: "amountMissing",
      header: "amount Missing",
      enableSearch: true,
      render: (value) => (
        <Text fontWeight="bold" color="blue.600">{String(value)}</Text>
      )
    },
    {
      key: "fkMedicationStorageId",
      header: "fk Medication Storage Id",
      enableSearch: true,
      render: (value) => (
        <Badge variant="solid" colorPalette="teal">{String(value)}</Badge>
      )
    },
    {
      key: "id",
      header: "id",
      enableSearch: true,
      render: (value) => (
        <Text fontSize="sm" fontStyle="italic">{String(value)}</Text>
      )
    },
    {
      key: "wentMissingAt",
      header: "went Missing At",
      enableSearch: true,
      render: (value) => (
        <Code colorPalette="orange">{String(value)}</Code>
      )
    }
  ];

  const [pageCount, setPageCount] = useState<number>(5);

  return (
    <>
      <p>this is Missing Medicin page</p>
      <br />
      <hr />
      <DataTable data={data} columns={columns} pageSize={pageCount} />

      <br />

      <Text>set page count</Text>
      <Input maxW={"100px"} value={pageCount} onChange={(e) => setPageCount(Number(e.target.value))} />
    </>
  );
}