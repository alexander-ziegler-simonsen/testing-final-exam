import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CommandFormPopup, type FieldConfig } from "./CommandFormPopup";
import { Provider } from "../ui/provider";

// CommandFormPopup renders a Chakra Dialog, so it only needs ChakraProvider -
// no router/auth involved. The `service` prop is the only thing under test's
// control, so it's mocked per test with vi.fn().
interface Person {
    name: string;
    age?: number;
}

const fields: FieldConfig<Person>[] = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "age", label: "Age", type: "number" },
];

function renderPopup(overrides: {
    create: (data: Person) => Promise<unknown>;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (mode: "create" | "edit" | "delete") => void;
}) {
    return render(
        <CommandFormPopup<Person>
            open={true}
            onOpenChange={overrides.onOpenChange}
            mode="create"
            title="Person"
            fields={fields}
            service={{ create: overrides.create }}
            onSuccess={overrides.onSuccess}
            testId="person-form"
        />,
        { wrapper: ({ children }) => <Provider>{children}</Provider> },
    );
}

test("blocks submit and shows an error when a required field is empty", async () => {
    const create = vi.fn<(data: Person) => Promise<unknown>>().mockResolvedValue(undefined);
    const onOpenChange = vi.fn<(open: boolean) => void>();

    const { getByTestId } = await renderPopup({ create, onOpenChange });

    await getByTestId("person-form-submit-button").click();

    await expect
        .element(getByTestId("person-form-error-name"))
        .toHaveTextContent("Name is required");
    expect(create).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
});

test("submits the filled-in values and closes the dialog on success", async () => {
    const create = vi.fn<(data: Person) => Promise<unknown>>().mockResolvedValue(undefined);
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const onSuccess = vi.fn<(mode: "create" | "edit" | "delete") => void>();

    const { getByTestId } = await renderPopup({ create, onOpenChange, onSuccess });

    await getByTestId("person-form-field-name").fill("Alice");
    await getByTestId("person-form-submit-button").click();

    await expect.poll(() => create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Alice" }),
    );
    await expect.poll(() => onSuccess).toHaveBeenCalledWith("create");
    await expect.poll(() => onOpenChange).toHaveBeenCalledWith(false);
});

