import { Badge, Code, Input, Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type { MedicationStorageMissing } from "../../entites/MedicationStorageMissing";
import { useState } from "react";

export default function MissingMedicin() {

  let data : MedicationStorageMissing[] = [
    {
      amountMissing: 1,
      fkMedicationStorageId: 1,
      id: 1,
      wentMissingAt: "now"
    },
    {
      amountMissing: 1,
      fkMedicationStorageId: 2,
      id: 2,
      wentMissingAt: "now"
    },
    {
      amountMissing: 1,
      fkMedicationStorageId: 3,
      id: 3,
      wentMissingAt: "that"
    },
    {
      amountMissing: 1,
      fkMedicationStorageId: 4,
      id: 4,
      wentMissingAt: "here"
    },
    {
      amountMissing: 1,
      fkMedicationStorageId: 5,
      id: 5,
      wentMissingAt: "yep"
    },
    {
      amountMissing: 1,
      fkMedicationStorageId: 6,
      id: 6,
      wentMissingAt: "now"
    }
  ]

const columns: ColumnConfig<MedicationStorageMissing>[] = [
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
      <br/>
      <hr/>
      <DataTable data={data} columns={columns} pageSize={pageCount}  />

      <br/>

      <Text>set page count</Text>
      <Input maxW={"100px"} value={pageCount} onChange={(e) => setPageCount(Number(e.target.value))} />
    </>
  );
}