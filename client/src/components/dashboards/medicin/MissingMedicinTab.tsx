import { useEffect, useState } from "react";
import { Badge, Code, Input, Text } from "@chakra-ui/react";
import { MedicationStorageMissingService } from "../../../services/medicin/MedicationStorageMissing";
import type { HospitalApiDtosOutputsMedicationStorageMissingOutputDto } from "../../../api";
import type { ColumnConfig } from "../../../hooks/useDataTable";
import { DataTable } from "../../../components/dashboards/DataTable";

const columns: ColumnConfig<HospitalApiDtosOutputsMedicationStorageMissingOutputDto>[] = [
  {
    key: "amountMissing", header: "amount Missing", enableSearch: true,
    render: (value) => (
      <Text fontWeight="bold" color="blue.600">{String(value)}</Text>
    )
  },
  {
    key: "fkMedicationStorageId", header: "fk Medication Storage Id", enableSearch: true,
    render: (value) => (
      <Badge variant="solid" colorPalette="teal">{String(value)}</Badge>
    )
  },
  {
    key: "id", header: "id", enableSearch: true,
    render: (value) => (
      <Text fontSize="sm" fontStyle="italic">{String(value)}</Text>
    )
  },
  {
    key: "wentMissingAt", header: "went Missing At", enableSearch: true,
    render: (value) => (
      <Code colorPalette="orange">{String(value)}</Code>
    )
  }
];

export default function MissingMedicinTab() {
  const [data, setData] = useState<HospitalApiDtosOutputsMedicationStorageMissingOutputDto[]>([]);
  const [pageCount, setPageCount] = useState<number>(5);

  useEffect(() => {
    MedicationStorageMissingService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <p data-testid="missing-medicine-page-heading">this is Missing Medicin page</p>
      <br />
      <hr />
      <DataTable testId="missing-medicine-table" data={data} columns={columns} pageSize={pageCount} />

      <br />

      <Text>set page count</Text>
      <Input data-testid="missing-medicine-page-size-input" maxW={"100px"} value={pageCount} onChange={(e) => setPageCount(Number(e.target.value))} />
    </>
  );
}
