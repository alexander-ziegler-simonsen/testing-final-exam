import { useState, type SubmitEvent } from "react";
import { Badge, Button, HStack, Input, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { LuSearch } from "react-icons/lu";
import { useExternalMedicinStore, type SearchMode } from "../../../stores/ExternalMedicinStore";
import { ExternalMedicinePricesService } from "../../../services/medicin/ExternalMedicinePrices";

const placeholders: Record<SearchMode, string> = {
  name: "Search by medicin name...",
  ingredient: "Search by ingredient...",
};

interface ExternalMedicinSearchTabProps {
  mode: SearchMode;
}

export default function ExternalMedicinSearchTab({ mode }: ExternalMedicinSearchTabProps) {
  const navigate = useNavigate();

  const query = useExternalMedicinStore((state) => state.query);
  const results = useExternalMedicinStore((state) => state.results);
  const searched = useExternalMedicinStore((state) => state.searched);
  const setSearch = useExternalMedicinStore((state) => state.setSearch);
  const missingDetailIds = useExternalMedicinStore((state) => state.missingDetailIds);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setQuery = (value: string) => setSearch({ searchMode: mode, query: value, results, searched });

  const handleSearch = (e: SubmitEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const request = mode === "name" ? ExternalMedicinePricesService.getAllByName(query.trim()) : ExternalMedicinePricesService.getAllByIngredient(query.trim());

    request
      .then((data) => setSearch({ searchMode: mode, query, results: data, searched: true }))
      .catch((err) => {
        setSearch({ searchMode: mode, query, results: [], searched: true });
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <HStack gap="4" mb="4" flexWrap="wrap" align="end">
          <Input placeholder={placeholders[mode]} value={query} onChange={(e) => setQuery(e.target.value)} maxW="400px" data-testid="external-medicin-search-input" />

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
                  data-testid={`external-medicin-row-${index}`}
                  cursor={knownMissing ? "not-allowed" : "pointer"}
                  opacity={knownMissing ? 0.5 : 1}
                  _hover={knownMissing ? undefined : { bg: "gray.50" }}
                  onClick={() => {
                    if (!knownMissing) {
                      navigate(`/app/external_medicin/${encodeURIComponent(product.varenummer)}`);
                    }
                  }}>
                  <Table.Cell>{product.navn}</Table.Cell>
                  <Table.Cell>{product.firma}</Table.Cell>
                  <Table.Cell>{product.styrke}</Table.Cell>
                  <Table.Cell>{product.pakning}</Table.Cell>
                  <Table.Cell data-testid={`external-medicin-details-${index}`} data-state={knownMissing ? "missing" : "available"}>
                    {knownMissing ? <Badge colorPalette="gray">No details</Badge> : <Badge colorPalette="teal">View</Badge>}
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
