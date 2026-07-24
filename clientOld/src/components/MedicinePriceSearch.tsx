import { useState } from "react"
import { Box, Button, Heading, Input, Text, VStack, HStack, Spinner, Badge } from "@chakra-ui/react"
import { medicinePriceService } from "../services/MedicinePriceService"
import type { MedicineProduct } from "../entites/MedicineProduct"
import type { MedicineDetail } from "../entites/MedicineDetail"

export default function MedicinePriceSearch() {
    // states
    const [query, setQuery] = useState("")
    const [searchMode, setSearchMode] = useState<"name" | "ingredient">("name")
    const [products, setProducts] = useState<MedicineProduct[]>([])
    const [detail, setDetail] = useState<MedicineDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // functions
    async function handleSearch() {
        
        // this stops the search if the query is empty or just whitespace
        // TODO - add some feedback, that tells the user, that they need to write something in the search field before they can search
        if (!query.trim()) return

        // reset our states
        setLoading(true)
        setError(null)
        setDetail(null)

        // try to use our external api service
        try {
            const results = searchMode === "name" ? await medicinePriceService.getByName(query) : await medicinePriceService.getByIngredient(query)

            // update the state with the results we got back from the API
            setProducts(results)
        } catch {
            setError("Could not fetch results. Is the API running?")
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    async function handleViewDetails(varenummer: string) {
        setLoading(true)
        setError(null)
        try {
            const result = await medicinePriceService.getDetails(varenummer)
            setDetail(result)
        } catch {
            setError("Could not fetch product details.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box borderWidth={1} borderRadius="lg" p={6} mt={6}>
            <Heading size="md" mb={4}>Medicine Price Search</Heading>

            <HStack mb={4}>
                <Button
                    size="sm"
                    bg={searchMode === "name" ? "blue.500" : "gray.subtle"}
                    color={searchMode === "name" ? "white" : undefined}
                    onClick={() => setSearchMode("name")}
                >
                    By Name
                </Button>
                <Button size="sm" bg={searchMode === "ingredient" ? "blue.500" : "gray.subtle"} color={searchMode === "ingredient" ? "white" : undefined} onClick={() => setSearchMode("ingredient")} >By Ingredient</Button>
            </HStack>

            <HStack mb={6}>
                <Input placeholder={searchMode === "name" ? "e.g. Ibuprofen" : "e.g. paracetamol"} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <Button bg="blue.500" color="white" onClick={handleSearch} px={6}>Search</Button>
            </HStack>

            {loading && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}

            {/* Product list */}
            {!detail && products.length > 0 && (
                <VStack align="stretch" gap={3}>
                    {products.map((p) => (
                        <Box key={p.varenummer} borderWidth={1} borderRadius="md" p={4}>
                            <HStack justify="space-between" align="start">
                                <Box>
                                    <Text fontWeight="bold">{p.navn}</Text>
                                    <Text fontSize="sm" color="gray.500">{p.firma} — {p.styrke} — {p.pakning}</Text>
                                    <Badge mt={1}>#{p.varenummer}</Badge>
                                </Box>
                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(p.varenummer)}>Details</Button>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}

            {/* Detail view - only seen when you click on a 'details' button */}
            {detail && (
                <Box borderWidth={1} borderRadius="md" p={4}>
                    <HStack justify="space-between" mb={3}>
                        <Heading size="sm">{detail.navn}</Heading>
                        <Button size="sm" variant="outline" onClick={() => setDetail(null)}>Back to results</Button>
                    </HStack>
                    <VStack align="start" gap={1} fontSize="sm">
                        {detail.firma && <Text><b>Firma:</b> {detail.firma}</Text>}
                        {detail.styrke && <Text><b>Styrke:</b> {detail.styrke}</Text>}
                        {detail.pakning && <Text><b>Pakning:</b> {detail.pakning}</Text>}
                        {detail.prisPrPakning && <Text><b>Pris pr. pakning:</b> {detail.prisPrPakning}</Text>}
                        {detail.prisPrEnhed && <Text><b>Pris pr. enhed:</b> {detail.prisPrEnhed}</Text>}
                        {detail.virksomtStof && <Text><b>Virksomt stof:</b> {detail.virksomtStof}</Text>}
                        {detail.atcKode && <Text><b>ATC-kode:</b> {detail.atcKode}</Text>}
                        {detail.udleveringsgruppe && <Text><b>Udleveringsgruppe:</b> {detail.udleveringsgruppe}</Text>}
                        {detail.indikation && <Text><b>Indikation:</b> {detail.indikation}</Text>}
                        {detail.dosering && <Text><b>Dosering:</b> {detail.dosering}</Text>}
                        <Text><b>Håndkøb:</b> {detail.Haandkoeb ? "Ja" : "Nej"}</Text>
                        <Text><b>Udgået:</b> {detail.Udgaaet ? `Ja (${detail.UdgaaetDato ?? ""})` : "Nej"}</Text>
                    </VStack>
                </Box>
            )}
        </Box>
    )
}
