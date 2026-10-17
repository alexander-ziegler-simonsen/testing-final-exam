import { useEffect, useState } from "react";
import type { HospitalApiDtosOutputsLocationOutputDto } from "../../../api";
import { useNavigate } from "react-router";
import { DataTable, type ColumnConfig } from "../DataTable";
import { LocationService } from "../../../services/facilities/Location";

interface BuildingRow {
  id?: number;
  name?: string;
  address?: string | null;
}

const columns: ColumnConfig<BuildingRow>[] = [
  { key: "id", header: "Id" },
  { key: "name", header: "Name", enableSearch: true },
  { key: "address", header: "Address", enableSearch: true },
];

export default function FacilitiesTab() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<HospitalApiDtosOutputsLocationOutputDto[]>([]);

  useEffect(() => {
    LocationService.getAll()
      .then(setLocations)
      .catch((error) => console.error(error));
  }, []);

  const rows: BuildingRow[] = locations.map((l) => ({
    id: l.building.id,
    name: l.building.name,
    address: l.building.address,
  }));

  return (
    <DataTable<BuildingRow> testId="facilities-table" data={rows} columns={columns} pageSize={10} onRowClick={(item) => navigate(`/app/facilities/${item.id}`)} />
  );
}
