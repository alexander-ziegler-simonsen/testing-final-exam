import { useEffect, useState } from "react";
import { Button, Dialog, Field, HStack, Input, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { LuLock } from "react-icons/lu";
import { toaster } from "../ui/toaster";
import { Popup } from "../ui/Popup";

const lockedFieldStyle = { bg: "bg.muted", color: "fg.muted", borderStyle: "dashed", cursor: "not-allowed" };

export type CommandFormMode = "create" | "edit" | "delete";

export type FieldValue = string | number;

export interface SelectOption { label: string; value: string | number; }

export interface FieldConfig<T> {
  key: keyof T & string;
  label: string;
  type: "text" | "number" | "select" | "datetime" | "date";
  // Options for "select" type fields.
  options?: SelectOption[];
  required?: boolean;
  placeholder?: string;
  // When true, this field is locked (read-only) while editing an existing
  // record, but still editable when creating a new one.
  lockedOnEdit?: boolean;
}

// Mirrors the shape of the generated services (e.g. DepartmentService,
// PatientService): create/update return the new id / void, delete returns void.
export interface CommandFormService<TInput, TId = number> {
  create?: (data: TInput) => Promise<unknown>;
  update?: (id: TId, data: TInput) => Promise<unknown>;
  delete?: (id: TId) => Promise<unknown>;
}

interface CommandFormPopupProps<TInput extends Record<string, any>, TId = number> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CommandFormMode;
  title: string;
  fields: FieldConfig<TInput>[]; // Pre-filled values, used for edit/delete to show the current record.
  initialValues?: Partial<TInput>;
  itemId?: TId; // Required for edit/delete, ignored for create.
  service: CommandFormService<TInput, TId>;
  onSuccess?: (mode: CommandFormMode) => void;
  testId?: string;
}

const MODE_LABEL: Record<CommandFormMode, string> = { create: "Create", edit: "Save", delete: "Delete", };
const DIALOG_TITLE_VERB: Record<CommandFormMode, string> = { create: "Create", edit: "Edit", delete: "Delete", };
const PAST_TENSE: Record<CommandFormMode, string> = { create: "created", edit: "updated", delete: "deleted", };
const INPUT_TYPE: Record<FieldConfig<any>["type"], string> = { text: "text", number: "number", select: "text", datetime: "datetime-local", date: "date", };

export function CommandFormPopup<TInput extends Record<string, any>, TId = number>({ open, onOpenChange, mode, title, fields, initialValues, itemId, service, onSuccess, testId = "command-form-popup" }: CommandFormPopupProps<TInput, TId>) {
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = mode === "delete";

  // Reset form state whenever the popup is (re)opened for a given record.
  useEffect(() => {
    if (!open) return;
    const next: Record<string, FieldValue> = {};
    for (const field of fields) {
      const initial = initialValues?.[field.key];
      next[field.key] = initial !== undefined && initial !== null ? (initial as FieldValue) : "";
    }
    setValues(next);
    setErrors({});
    setIsSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, itemId]);

  const dialogTitle = `${DIALOG_TITLE_VERB[mode]} ${title}`;

  const handleChange = (key: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!field.required) continue;
      const value = values[field.key];
      if (value === undefined || value === null || value === "") {
        nextErrors[field.key] = `${field.label} is required`;
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Runs the service call for the current mode; throws if the form was
  // handed a service that doesn't support it, or an edit/delete with no id.
  const runAction = (payload: Record<string, FieldValue | undefined>) => {
    if (mode === "create") {
      if (!service.create) throw new Error("Create is not supported for this form");
      return service.create(payload as unknown as TInput);
    }
    if (mode === "edit") {
      if (!service.update) throw new Error("Edit is not supported for this form");
      if (itemId === undefined) throw new Error("Missing id for edit");
      return service.update(itemId, payload as unknown as TInput);
    }
    if (!service.delete) throw new Error("Delete is not supported for this form");
    if (itemId === undefined) throw new Error("Missing id for delete");
    return service.delete(itemId);
  };

  const handleSubmit = async () => {
    if (mode !== "delete" && !validate()) return;

    // Optional fields left blank submit "" from the inputs above, but the
    // API's DTOs treat unset optional strings as null/undefined, not "" -
    // an empty string trips their min-length validation.
    const payload: Record<string, FieldValue | undefined> = { ...values };
    for (const field of fields) {
      if (!field.required && payload[field.key] === "") {
        payload[field.key] = undefined;
      }
    }

    setIsSubmitting(true);
    try {
      await runAction(payload);

      toaster.create({ type: "success", title: `${title} ${PAST_TENSE[mode]}`,});
      onSuccess?.(mode);
      onOpenChange(false);
    } catch (error: any) {
      toaster.create({ type: "error", title: `Failed to ${mode} ${title.toLowerCase()}`, description: error?.message ?? "Something went wrong.",});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popup open={open} onOpenChange={onOpenChange} title={dialogTitle} testId={testId}
      footer={
        <HStack gap="3">
          <Dialog.CloseTrigger asChild>
            <Button variant="outline" data-testid={`${testId}-cancel-button`} disabled={isSubmitting}>
              Cancel
            </Button>
          </Dialog.CloseTrigger>
          <Button colorPalette={mode === "delete" ? "red" : "blue"} onClick={handleSubmit} loading={isSubmitting} data-testid={`${testId}-submit-button`}>
            {MODE_LABEL[mode]}
          </Button>
        </HStack>
      }>
      <Stack gap="4">
        {mode === "delete" && (
          <Text color="fg.muted" data-testid={`${testId}-delete-warning`}>
            Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
          </Text>
        )}

        {fields.map((field) => {
          const fieldLocked = isLocked || (mode === "edit" && field.lockedOnEdit);
          return (
            <Field.Root key={field.key} invalid={!!errors[field.key]} required={field.required} disabled={fieldLocked || isSubmitting}>
              <Field.Label>
                {field.label}
                {field.required && <Field.RequiredIndicator />}
                {fieldLocked && <LuLock data-testid={`${testId}-lock-${field.key}`} />}
              </Field.Label>

              {field.type === "select" ? (
                <NativeSelect.Root size="sm" width="full" disabled={fieldLocked || isSubmitting}>
                  <NativeSelect.Field data-testid={`${testId}-field-${field.key}`}
                    value={values[field.key] ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Options may carry numeric values (e.g. a FK id); match
                      // back to the original option to preserve its type.
                      const matched = field.options?.find((option) => String(option.value) === raw);
                      handleChange(field.key, matched ? matched.value : raw);
                    }}
                    _disabled={lockedFieldStyle}>
                    <option value="" disabled>
                      {field.placeholder ?? `Select ${field.label}`}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              ) : (
                <Input
                  data-testid={`${testId}-field-${field.key}`}
                  type={INPUT_TYPE[field.type]}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  readOnly={fieldLocked}
                  disabled={isSubmitting}
                  _readOnly={lockedFieldStyle}
                  onChange={(e) => handleChange(field.key, field.type === "number" ? e.target.valueAsNumber : e.target.value)}
                />
              )}

              {errors[field.key] && <Field.ErrorText data-testid={`${testId}-error-${field.key}`}>{errors[field.key]}</Field.ErrorText>}
            </Field.Root>
          );
        })}
      </Stack>
    </Popup>
  );
}
