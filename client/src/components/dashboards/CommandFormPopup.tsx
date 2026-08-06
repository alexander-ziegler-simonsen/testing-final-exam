import { useEffect, useMemo, useState } from "react";
import { Button, Dialog, Field, HStack, Input, NativeSelect, Portal, Stack, Text } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";

export type CommandFormMode = "create" | "edit" | "delete";

export type FieldValue = string | number;

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface FieldConfig<T> {
    key: keyof T & string;
    label: string;
    type: "text" | "number" | "select" | "datetime";
    // Options for "select" type fields.
    options?: SelectOption[];
    required?: boolean;
    placeholder?: string;
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
    fields: FieldConfig<TInput>[];
    // Pre-filled values, used for edit/delete to show the current record.
    initialValues?: Partial<TInput>;
    // Required for edit/delete, ignored for create.
    itemId?: TId;
    service: CommandFormService<TInput, TId>;
    onSuccess?: (mode: CommandFormMode) => void;
    testId?: string;
}

const MODE_LABEL: Record<CommandFormMode, string> = {
    create: "Create",
    edit: "Save",
    delete: "Delete",
};

export function CommandFormPopup<TInput extends Record<string, any>, TId = number>({
    open,
    onOpenChange,
    mode,
    title,
    fields,
    initialValues,
    itemId,
    service,
    onSuccess,
    testId = "command-form-popup",
}: CommandFormPopupProps<TInput, TId>) {
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
            if (initial !== undefined && initial !== null) {
                next[field.key] = initial as FieldValue;
            } else if (field.type === "number") {
                next[field.key] = "";
            } else {
                next[field.key] = "";
            }
        }
        setValues(next);
        setErrors({});
        setIsSubmitting(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, itemId]);

    const dialogTitle = useMemo(() => {
        if (mode === "create") return `Create ${title}`;
        if (mode === "edit") return `Edit ${title}`;
        return `Delete ${title}`;
    }, [mode, title]);

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
            if (mode === "create") {
                if (!service.create) throw new Error("Create is not supported for this form");
                await service.create(payload as unknown as TInput);
            } else if (mode === "edit") {
                if (!service.update) throw new Error("Edit is not supported for this form");
                if (itemId === undefined) throw new Error("Missing id for edit");
                await service.update(itemId, payload as unknown as TInput);
            } else {
                if (!service.delete) throw new Error("Delete is not supported for this form");
                if (itemId === undefined) throw new Error("Missing id for delete");
                await service.delete(itemId);
            }

            toaster.create({
                type: "success",
                title: `${title} ${mode === "create" ? "created" : mode === "edit" ? "updated" : "deleted"}`,
            });
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
        <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} data-testid={testId}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content data-testid={`${testId}-content`}>
                        <Dialog.Header>
                            <Dialog.Title data-testid={`${testId}-title`}>{dialogTitle}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Stack gap="4">
                                {mode === "delete" && (
                                    <Text color="fg.muted" data-testid={`${testId}-delete-warning`}>
                                        Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
                                    </Text>
                                )}

                                {fields.map((field) => (
                                    <Field.Root key={field.key} invalid={!!errors[field.key]} required={field.required} disabled={isLocked || isSubmitting}>
                                        <Field.Label>
                                            {field.label}
                                            {field.required && <Field.RequiredIndicator />}
                                        </Field.Label>

                                        {field.type === "select" ? (
                                            <NativeSelect.Root size="sm" width="full" disabled={isLocked || isSubmitting}>
                                                <NativeSelect.Field
                                                    data-testid={`${testId}-field-${field.key}`}
                                                    value={values[field.key] ?? ""}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        // Options may carry numeric values (e.g. a FK id); match
                                                        // back to the original option to preserve its type.
                                                        const matched = field.options?.find((option) => String(option.value) === raw);
                                                        handleChange(field.key, matched ? matched.value : raw);
                                                    }}
                                                >
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
                                                type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"}
                                                placeholder={field.placeholder}
                                                value={values[field.key] ?? ""}
                                                readOnly={isLocked}
                                                disabled={isSubmitting}
                                                onChange={(e) =>
                                                    handleChange(field.key, field.type === "number" ? e.target.valueAsNumber : e.target.value)
                                                }
                                            />
                                        )}

                                        {errors[field.key] && (
                                            <Field.ErrorText data-testid={`${testId}-error-${field.key}`}>{errors[field.key]}</Field.ErrorText>
                                        )}
                                    </Field.Root>
                                ))}
                            </Stack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack gap="3">
                                <Dialog.CloseTrigger asChild>
                                    <Button variant="outline" data-testid={`${testId}-cancel-button`} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </Dialog.CloseTrigger>
                                <Button
                                    colorPalette={mode === "delete" ? "red" : "blue"}
                                    onClick={handleSubmit}
                                    loading={isSubmitting}
                                    data-testid={`${testId}-submit-button`}
                                >
                                    {MODE_LABEL[mode]}
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
