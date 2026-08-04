import { useEffect, useMemo, useState } from "react";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuKeyRound, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormMode, type CommandFormService, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type { HospitalApiDtosInputsRegisterInputDto, HospitalApiDtosOutputsStaffOutputDto, HospitalApiDtosOutputsUserOutputDto } from "../../api";
import { UserService } from "../../services/User";
import { StaffService } from "../../services/Staff";

// Extends the output DTO with a synthetic column key for the actions cell,
// since ColumnConfig keys must be keyof T.
type UserRow = HospitalApiDtosOutputsUserOutputDto & { actions?: undefined };

export default function Staff() {
  const [users, setUsers] = useState<HospitalApiDtosOutputsUserOutputDto[]>([]);
  const [staff, setStaff] = useState<HospitalApiDtosOutputsStaffOutputDto[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<CommandFormMode>("create");
  const [selectedUser, setSelectedUser] = useState<HospitalApiDtosOutputsUserOutputDto | null>(null);

  const loadUsers = () => {
    UserService.getAll()
      .then(setUsers)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadUsers();
    StaffService.getAll()
      .then(setStaff)
      .catch((error) => console.error(error));
  }, []);

  const staffName = (staffId?: number) => {
    const match = staff.find((s) => s.id === staffId);
    if (match) return [match.firstname, match.lastname].filter(Boolean).join(" ");
    return staffId ? `#${staffId}` : "—";
  };

  const openCreate = () => {
    setSelectedUser(null);
    setPopupMode("create");
    setPopupOpen(true);
  };

  const openEdit = (user: HospitalApiDtosOutputsUserOutputDto) => {
    setSelectedUser(user);
    setPopupMode("edit");
    setPopupOpen(true);
  };

  const openDelete = (user: HospitalApiDtosOutputsUserOutputDto) => {
    setSelectedUser(user);
    setPopupMode("delete");
    setPopupOpen(true);
  };

  const staffOptions = useMemo(
    () =>
      staff.map((s) => ({
        label: [s.firstname, s.lastname].filter(Boolean).join(" ") || `Staff #${s.id}`,
        value: s.id ?? 0,
      })),
    [staff],
  );

  // "Edit" on a user account only ever changes the password - the API has no
  // endpoint to rename a username or re-point fkStaffId - so the field list
  // is mode-dependent instead of shared between create and edit.
  const userFields: FieldConfig<HospitalApiDtosInputsRegisterInputDto>[] = useMemo(() => {
    if (popupMode === "edit") {
      return [{ key: "password", label: "New Password", type: "text", required: true }];
    }
    return [
      { key: "username", label: "Username", type: "text", required: true },
      { key: "password", label: "Password", type: "text", required: true },
      { key: "fkStaffId", label: "Staff Member", type: "select", required: true, options: staffOptions },
    ];
  }, [popupMode, staffOptions]);

  const userFormService: CommandFormService<HospitalApiDtosInputsRegisterInputDto> = useMemo(
    () => ({
      create: (values) => UserService.register(values),
      update: (id, values) => UserService.changePassword(id, String(values.password ?? "")),
      delete: (id) => UserService.delete(id),
    }),
    [],
  );

  const columns: ColumnConfig<UserRow>[] = [
    { key: "id", header: "Id" },
    { key: "username", header: "Username", enableSearch: true },
    {
      key: "fkStaffId",
      header: "Staff Member",
      enableSearch: true,
      sortValue: (item) => staffName(item.fkStaffId),
      render: (_value, item) => staffName(item.fkStaffId),
    },
    {
      key: "actions",
      header: "Actions",
      enableSort: false,
      render: (_value, item) => (
        <HStack gap="2">
          <IconButton
            aria-label="Change password"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(item);
            }}
            data-testid={`staff-edit-${item.id}`}
          >
            <LuKeyRound />
          </IconButton>
          <IconButton
            aria-label="Delete user"
            size="sm"
            variant="ghost"
            colorPalette="red"
            onClick={(e) => {
              e.stopPropagation();
              openDelete(item);
            }}
            data-testid={`staff-delete-${item.id}`}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      ),
    },
  ];

  return (
    <>
      <HStack justify="space-between" mb="4">
        <Text data-testid="staff-page-heading" fontSize="xl" fontWeight="bold">
          Staff Accounts
        </Text>
        <Button data-testid="staff-add-button" onClick={openCreate}>
          <LuPlus /> Add User
        </Button>
      </HStack>

      <DataTable<UserRow> testId="staff-table" data={users} columns={columns} pageSize={10} />

      <CommandFormPopup<HospitalApiDtosInputsRegisterInputDto>
        open={popupOpen}
        onOpenChange={setPopupOpen}
        mode={popupMode}
        title="User"
        fields={userFields}
        itemId={selectedUser?.id}
        initialValues={selectedUser ?? undefined}
        service={userFormService}
        onSuccess={loadUsers}
        testId="staff-form"
      />
    </>
  );
}
