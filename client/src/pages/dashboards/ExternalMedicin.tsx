import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { Badge, Button, HStack, Input, Table, Text } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import type { HospitalApiDtosExternalMedicineProductOutputDto } from "../../api";
import { ExternalMedicinePricesService } from "../../services/ExternalMedicinePrices";
import { useExternalMedicinStore } from "../../stores/ExternalMedicinStore";

type SearchMode = "name" | "ingredient";

export default function ExternalMedicin() {
    const navigate = useNavigate();

    const [searchMode, setSearchMode] = useState<SearchMode>("name");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<HospitalApiDtosExternalMedicineProductOutputDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const missingDetailIds = useExternalMedicinStore((state) => state.missingDetailIds);

    const handleSearch = (e: SubmitEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        const request =
            searchMode === "name"
                ? ExternalMedicinePricesService.getAllByName(query.trim())
                : ExternalMedicinePricesService.getAllByIngredient(query.trim());

        request
            .then(setResults)
            .catch((err) => {
                setResults([]);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
                setSearched(true);
            });
    };

    return (
        <>
            <Text data-testid="external-medicin-page-heading" fontSize="xl" fontWeight="bold" mb="4">
                Find Medicin Price
            </Text>

            <form onSubmit={handleSearch}>
                <HStack gap="4" mb="4" flexWrap="wrap" align="end">
                    {/* Toggle between searching the external registry by product name or by active ingredient */}
                    <HStack gap="0" data-testid="external-medicin-mode-toggle">
                        <Button
                            type="button"
                            size="sm"
                            variant={searchMode === "name" ? "solid" : "outline"}
                            borderRightRadius="0"
                            onClick={() => setSearchMode("name")}
                            data-testid="external-medicin-mode-name"
                        >
                            By Name
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={searchMode === "ingredient" ? "solid" : "outline"}
                            borderLeftRadius="0"
                            onClick={() => setSearchMode("ingredient")}
                            data-testid="external-medicin-mode-ingredient"
                        >
                            By Ingredient
                        </Button>
                    </HStack>

                    <Input
                        placeholder={searchMode === "name" ? "Search by medicin name..." : "Search by ingredient..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        maxW="400px"
                        data-testid="external-medicin-search-input"
                    />

                    <Button type="submit" loading={loading} data-testid="external-medicin-search-button">
                        <LuSearch /> Search
                    </Button>
                </HStack>
            </form>

            {error && (
                <Text data-testid="external-medicin-error" color="red.500" mb="4">
                    {error}
                </Text>
            )}

            <Table.Root variant="line" size="md" interactive data-testid="external-medicin-results-table">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Company</Table.ColumnHeader>
                        <Table.ColumnHeader>Strength</Table.ColumnHeader>
                        <Table.ColumnHeader>Packaging</Table.ColumnHeader>
                        <Table.ColumnHeader>Details</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {results.length > 0 ? (
                        results.map((product, index) => {
                            // We only learn whether a product's detail page actually has
                            // data by visiting it (see OneExternalMedicin), so this reflects
                            // what a past visit found, not something the search response tells us.
                            const knownMissing = missingDetailIds.includes(product.varenummer);
                            return (
                                <Table.Row
                                    key={`${product.varenummer}-${index}`}
                                    cursor={knownMissing ? "not-allowed" : "pointer"}
                                    opacity={knownMissing ? 0.5 : 1}
                                    _hover={knownMissing ? undefined : { bg: "gray.50" }}
                                    onClick={() => {
                                        if (!knownMissing) {
                                            navigate(`/app/external_medicin/${encodeURIComponent(product.varenummer)}`);
                                        }
                                    }}
                                    data-testid={`external-medicin-row-${index}`}
                                >
                                    <Table.Cell>{product.navn}</Table.Cell>
                                    <Table.Cell>{product.firma}</Table.Cell>
                                    <Table.Cell>{product.styrke}</Table.Cell>
                                    <Table.Cell>{product.pakning}</Table.Cell>
                                    <Table.Cell>
                                        {knownMissing ? (
                                            <Badge colorPalette="gray">No details</Badge>
                                        ) : (
                                            <Badge colorPalette="teal">View</Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={5} textAlign="center" paddingY="6">
                                {searched ? "No products found." : "Search for a medicin to see prices."}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </>
    );
}
