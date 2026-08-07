import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { DataTable, type ColumnConfig } from "./DataTable";
import { Provider } from "../ui/provider";

// DataTable renders plain Chakra components (Table/Input/NativeSelect/
// Pagination), so it only needs ChakraProvider - no router/auth involved.
interface Person {
    name: string;
    age: number;
}

const people: Person[] = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Carol", age: 40 },
];

const columns: ColumnConfig<Person>[] = [
    { key: "name", header: "Name", enableSearch: true },
    { key: "age", header: "Age" },
];

function renderTable() {
    return render(
        <DataTable data={people} columns={columns} testId="people-table" />,
        { wrapper: ({ children }) => <Provider>{children}</Provider> },
    );
}

test("renders a row per item with the correct cell values", async () => {
    const { getByTestId } = await renderTable();

    await expect
        .element(getByTestId("people-table-row-0-cell-name"))
        .toHaveTextContent("Alice");
    await expect
        .element(getByTestId("people-table-row-0-cell-age"))
        .toHaveTextContent("30");
    await expect
        .element(getByTestId("people-table-row-2-cell-name"))
        .toHaveTextContent("Carol");
});

test("searching a column filters rows down to matches", async () => {
    const { getByTestId } = await renderTable();

    await getByTestId("people-table-search-name").fill("bo");

    // Filtering re-derives row indices from the filtered set, so the single
    // match ends up at row 0.
    await expect
        .element(getByTestId("people-table-row-0-cell-name"))
        .toHaveTextContent("Bob");
    await expect
        .element(getByTestId("people-table-row-1-cell-name"))
        .not.toBeInTheDocument();
});

test("shows the empty state when no row matches the search", async () => {
    const { getByTestId } = await renderTable();

    await getByTestId("people-table-search-name").fill("zzz");

    await expect
        .element(getByTestId("people-table-empty-state"))
        .toHaveTextContent("No matching records found.");
});

