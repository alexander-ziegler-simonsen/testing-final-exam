import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type { HospitalApiDtosOutputsLocationOutputDto } from "../../api";
import { LocationService } from "../../services/Location";

interface BuildingRow {
    id?: number;
    name?: string;
    address?: string | null;
}

export default function Facilities() {
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

    const columns: ColumnConfig<BuildingRow>[] = [
        { key: "id", header: "Id" },
        { key: "name", header: "Name", enableSearch: true },
        { key: "address", header: "Address", enableSearch: true },
    ];

    return (
        <>
            <Text data-testid="facilities-page-heading" fontSize="xl" fontWeight="bold" mb="4">Facilities</Text>
            <DataTable<BuildingRow> testId="facilities-table" data={rows} columns={columns} pageSize={10} onRowClick={(item) => navigate(`/app/facilities/${item.id}`)} />
        </>
    );
}
