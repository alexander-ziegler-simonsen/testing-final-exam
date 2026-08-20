import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormMode, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type {
    HospitalApiDtosInputsMedicationStorageInputDto,
    HospitalApiDtosOutputsMedicationOutputDto,
    HospitalApiDtosOutputsMedicationStorageOutputDto,
} from "../../api";
import { MedicationStorageService } from "../../services/MedicationStorage";
import { MedicationService } from "../../services/Medication";
import { useAuthStore } from "../../stores/AuthStore";

interface StorageRow {
    id?: number;
    medicationName: string;
    amount: number;
    fkMedicationId?: number;
}

export default function MedicinStorage() {
    const navigate = useNavigate();
    const isAdmin = useAuthStore((state) => state.user?.role === "admin");

    const [storages, setStorages] = useState<HospitalApiDtosOutputsMedicationStorageOutputDto[]>([]);
    const [medications, setMedications] = useState<HospitalApiDtosOutputsMedicationOutputDto[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<CommandFormMode>("edit");
    const [selectedStorage, setSelectedStorage] = useState<HospitalApiDtosOutputsMedicationStorageOutputDto | null>(null);

    const loadStorages = () => {
        MedicationStorageService.getAll()
            .then(setStorages)
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        loadStorages();
        MedicationService.getAll().then(setMedications).catch((error) => console.error(error));
    }, []);

    const medicationMap = useMemo(() => new Map(medications.map((m) => [m.id, m])), [medications]);

    const rows: StorageRow[] = useMemo(
        () =>
            storages.map((s) => ({
                id: s.id,
                medicationName: medicationMap.get(s.fkMedicationId)?.name ?? `Medication #${s.fkMedicationId}`,
                amount: s.amount ?? 0,
                fkMedicationId: s.fkMedicationId,
            })),
        [storages, medicationMap],
    );

    const openCreate = () => {
        setSelectedStorage(null);
        setPopupMode("create");
        setPopupOpen(true);
    };

    const openEdit = (storage: HospitalApiDtosOutputsMedicationStorageOutputDto) => {
        setSelectedStorage(storage);
        setPopupMode("edit");
        setPopupOpen(true);
    };

    const openDelete = (storage: HospitalApiDtosOutputsMedicationStorageOutputDto) => {
        setSelectedStorage(storage);
        setPopupMode("delete");
        setPopupOpen(true);
    };

    const medicationOptions = useMemo(
        () => medications.map((m) => ({ label: m.name ?? `Medication #${m.id}`, value: m.id ?? 0 })),
        [medications],
    );

    // Regular staff may only change the stored amount; picking the medication
    // is only relevant when an admin creates a brand new storage row.
    const storageFields: FieldConfig<HospitalApiDtosInputsMedicationStorageInputDto>[] = useMemo(() => {
        if (popupMode === "create") {
            return [
                { key: "fkMedicationId", label: "Medication", type: "select", required: true, options: medicationOptions },
                { key: "amount", label: "Amount", type: "number", required: true },
            ];
        }
        return [{ key: "amount", label: "Amount", type: "number", required: true }];
    }, [popupMode, medicationOptions]);

    const columns: ColumnConfig<StorageRow>[] = [
        { key: "id", header: "Id" },
        { key: "medicationName", header: "Medication", enableSearch: true },
        { key: "amount", header: "Amount" },
        {
            key: "actions" as keyof StorageRow,
            header: "Actions",
            enableSort: false,
            render: (_value, item) => {
                const storage = storages.find((s) => s.id === item.id);
                if (!storage) return null;
                return (
                    <HStack gap="2">
                        <IconButton aria-label="Edit amount" size="sm" variant="ghost" data-testid={`medicin-storage-edit-${item.id}`} onClick={(e) => {
                                e.stopPropagation();
                                openEdit(storage);
                            }}><LuPencil /></IconButton>
                        {isAdmin && (
                            <IconButton aria-label="Delete storage" size="sm" variant="ghost" colorPalette="red" onClick={(e) => {
                                    e.stopPropagation();
                                    openDelete(storage);
                                }} data-testid={`medicin-storage-delete-${item.id}`}><LuTrash2 /></IconButton>
                        )}
                    </HStack>
                );
            },
        },
    ];

    return (
        <>
            <HStack justify="space-between" mb="4">
                <Text data-testid="medicin-storage-page-heading" fontSize="xl" fontWeight="bold">Medicin Storage</Text>
                {isAdmin && (
                    <Button data-testid="medicin-storage-add-button" onClick={openCreate}>
                        <LuPlus /> Add Storage
                    </Button>
                )}
            </HStack>

            <DataTable<StorageRow> testId="medicin-storage-table" data={rows} columns={columns} pageSize={10} onRowClick={(item) => navigate(`/app/medicin_storage/${item.id}`)} />

            <CommandFormPopup<HospitalApiDtosInputsMedicationStorageInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Medicin Storage" fields={storageFields}
                itemId={selectedStorage?.id} initialValues={selectedStorage ?? undefined} service={MedicationStorageService} onSuccess={loadStorages} testId="medicin-storage-form" />
        </>
    );
}
