import { useEffect, useState } from "react";
import { Button, Dialog, Field, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { LuLock } from "react-icons/lu";
import { toaster } from "../ui/toaster";
import { Popup } from "../ui/Popup";
import type { CommandFormMode, CommandFormService } from "./CommandFormPopup";

export interface SimpleFieldConfig<T> {
  key: keyof T & string;
  label: string;
  type: "text" | "number";
  placeholder?: string;
  lockedOnEdit?: boolean; // Locked (read-only) while editing an existing record, still editable when creating.
}

type FieldValue = string | number;

const lockedFieldStyle = { bg: "bg.muted", color: "fg.muted", borderStyle: "dashed", cursor: "not-allowed" };

const MODE_LABEL: Record<CommandFormMode, string> = { create: "Create", edit: "Save", delete: "Delete" };
const DIALOG_TITLE_VERB: Record<CommandFormMode, string> = { create: "Create", edit: "Edit", delete: "Delete" };
const PAST_TENSE: Record<CommandFormMode, string> = { create: "created", edit: "updated", delete: "deleted" };

interface SimpleCommandFormPopupProps<TInput extends Record<string, any>, TId = number> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CommandFormMode;
  title: string;
  fields: SimpleFieldConfig<TInput>[];
  initialValues?: Partial<TInput>; // Pre-filled values, used for edit/delete to show the current record.
  itemId?: TId; // Required for edit/delete, ignored for create.
  service: CommandFormService<TInput, TId>;
  onSuccess?: (mode: CommandFormMode) => void;
  testId?: string;
}

export function SimpleCommandFormPopup<TInput extends Record<string, any>, TId = number>({ open, onOpenChange, mode, title, fields, initialValues, itemId, service, onSuccess, testId = "simple-command-form-popup" }: SimpleCommandFormPopupProps<TInput, TId>) {
  // One popup for create/edit/delete, same as CommandFormPopup - but text and number fields only, and no validation.
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = mode === "delete";

  useEffect(() => {
    // Reset form state whenever the popup is (re)opened for a given record.
    if (!open) return;
    const next: Record<string, FieldValue> = {};
    for (const field of fields) {
      const initial = initialValues?.[field.key];
      next[field.key] = initial !== undefined && initial !== null ? (initial as FieldValue) : "";
    }
    setValues(next);
    setIsSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, itemId]);

  const handleChange = (key: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const runAction = (payload: Record<string, FieldValue | undefined>) => {
    // Runs the service call for the current mode; throws if the form was handed a service that doesn't support it, or an edit/delete with no id.
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
    // A blank field submits "" from the input above, but the API's DTOs treat unset optional strings as null/undefined, not "".
    const payload: Record<string, FieldValue | undefined> = { ...values };
    for (const field of fields) {
      if (payload[field.key] === "") payload[field.key] = undefined;
    }

    setIsSubmitting(true);
    try {
      await runAction(payload);

      toaster.create({ type: "success", title: `${title} ${PAST_TENSE[mode]}` });
      onSuccess?.(mode);
      onOpenChange(false);
    } catch (error: any) {
      toaster.create({
        type: "error",
        title: `Failed to ${mode} ${title.toLowerCase()}`,
        description: error?.message ?? "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popup
      open={open}
      onOpenChange={onOpenChange}
      title={`${DIALOG_TITLE_VERB[mode]} ${title}`}
      testId={testId}
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
            <Field.Root key={field.key} disabled={fieldLocked || isSubmitting}>
              <Field.Label>
                {field.label}
                {fieldLocked && <LuLock data-testid={`${testId}-lock-${field.key}`} />}
              </Field.Label>
              <Input
                data-testid={`${testId}-field-${field.key}`}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.key] ?? ""}
                readOnly={fieldLocked}
                disabled={isSubmitting}
                _readOnly={lockedFieldStyle}
                onChange={(e) => handleChange(field.key, field.type === "number" ? e.target.valueAsNumber : e.target.value)}
              />
            </Field.Root>
          );
        })}
      </Stack>
    </Popup>
  );
}
