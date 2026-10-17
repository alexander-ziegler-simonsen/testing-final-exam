import type { HospitalApiDtosInputsDepartmentInputDto } from "../../../api";
import type { FieldConfig } from "../CommandFormPopup";

// Shared by DepartmentsTab (create) and OneDepartmentPage (edit/delete).
export const departmentFields: FieldConfig<HospitalApiDtosInputsDepartmentInputDto>[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "type", label: "Type", type: "text", required: true },
];
