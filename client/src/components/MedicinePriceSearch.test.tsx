// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/MedicinePriceService', () => ({
    medicinePriceService: {
        getByName: vi.fn(),
        getByIngredient: vi.fn(),
        getDetails: vi.fn(),
    },
}))

import { medicinePriceService } from '../services/MedicinePriceService'
import MedicinePriceSearch from './MedicinePriceSearch'

const mockGetByName = medicinePriceService.getByName as ReturnType<typeof vi.fn>
const mockGetByIngredient = medicinePriceService.getByIngredient as ReturnType<typeof vi.fn>
const mockGetDetails = medicinePriceService.getDetails as ReturnType<typeof vi.fn>

const sampleProducts = [
    { varenummer: '001', navn: 'Panodil', firma: 'Karo Pharma', styrke: '500 mg', pakning: '20 stk' },
    { varenummer: '002', navn: 'Ipren', firma: 'Karo Pharma', styrke: '200 mg', pakning: '24 stk' },
]

const sampleDetail = {
    varenummer: '001',
    navn: 'Panodil',
    firma: 'Karo Pharma',
    styrke: '500 mg',
    pakning: '20 stk',
    prisPrPakning: '29.95',
    prisPrEnhed: '1.50',
    virksomtStof: 'Paracetamol',
    atcKode: 'N02BE01',
    udleveringsgruppe: 'HF',
    indikation: 'Pain relief',
    dosering: '1-2 tablets',
    Haandkoeb: true,
    Udgaaet: false,
    UdgaaetDato: null,
}

describe('MedicinePriceSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetByName.mockResolvedValue([])
        mockGetByIngredient.mockResolvedValue([])
        mockGetDetails.mockResolvedValue(sampleDetail)
    })

    it('renders the Medicine Price Search heading', () => {
        // Act
        renderWithChakra(<MedicinePriceSearch />)

        // Assert
        expect(screen.getByRole('heading', { name: /Medicine Price Search/i })).toBeInTheDocument()
    })

    it('renders the "By Name" and "By Ingredient" mode buttons', () => {
        // Act
        renderWithChakra(<MedicinePriceSearch />)

        // Assert
        expect(screen.getByRole('button', { name: /By Name/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /By Ingredient/i })).toBeInTheDocument()
    })

    it('renders the search input and Search button', () => {
        // Act
        renderWithChakra(<MedicinePriceSearch />)

        // Assert
        expect(screen.getByPlaceholderText(/e.g. Ibuprofen/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument()
    })

    it('does not call the service when search query is empty', async () => {
        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))

        // Assert - wait a tick then check
        await new Promise(r => setTimeout(r, 10))
        expect(mockGetByName).not.toHaveBeenCalled()
    })

    it('calls getByName when searching by name mode', async () => {
        // Arrange
        mockGetByName.mockResolvedValue(sampleProducts)

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.change(screen.getByPlaceholderText(/e.g. Ibuprofen/i), { target: { value: 'Panodil' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))

        // Assert
        await waitFor(() => expect(mockGetByName).toHaveBeenCalledWith('Panodil'))
    })

    it('renders product results after a successful name search', async () => {
        // Arrange
        mockGetByName.mockResolvedValue(sampleProducts)

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.change(screen.getByPlaceholderText(/e.g. Ibuprofen/i), { target: { value: 'Panodil' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))

        // Assert
        await waitFor(() => expect(screen.getByText('Panodil')).toBeInTheDocument())
        expect(screen.getByText('Ipren')).toBeInTheDocument()
    })

    it('switches to getByIngredient when By Ingredient mode is selected', async () => {
        // Arrange
        mockGetByIngredient.mockResolvedValue(sampleProducts)

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.click(screen.getByRole('button', { name: /By Ingredient/i }))
        fireEvent.change(screen.getByPlaceholderText(/e.g. paracetamol/i), { target: { value: 'paracetamol' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))

        // Assert
        await waitFor(() => expect(mockGetByIngredient).toHaveBeenCalledWith('paracetamol'))
    })

    it('shows an error message when the search API fails', async () => {
        // Arrange
        mockGetByName.mockRejectedValue(new Error('API down'))

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.change(screen.getByPlaceholderText(/e.g. Ibuprofen/i), { target: { value: 'anything' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))

        // Assert
        await waitFor(() =>
            expect(screen.getByText(/Could not fetch results/i)).toBeInTheDocument()
        )
    })

    it('shows product details when Details button is clicked', async () => {
        // Arrange
        mockGetByName.mockResolvedValue(sampleProducts)

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.change(screen.getByPlaceholderText(/e.g. Ibuprofen/i), { target: { value: 'Panodil' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))
        await waitFor(() => expect(screen.getAllByRole('button', { name: /Details/i })[0]).toBeInTheDocument())
        fireEvent.click(screen.getAllByRole('button', { name: /Details/i })[0])

        // Assert
        await waitFor(() => expect(mockGetDetails).toHaveBeenCalledWith('001'))
        expect(screen.getByText(/Paracetamol/)).toBeInTheDocument()
    })

    it('"Back to results" button dismisses the detail view', async () => {
        // Arrange
        mockGetByName.mockResolvedValue(sampleProducts)

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        fireEvent.change(screen.getByPlaceholderText(/e.g. Ibuprofen/i), { target: { value: 'Panodil' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))
        await waitFor(() => expect(screen.getAllByRole('button', { name: /Details/i })[0]).toBeInTheDocument())
        fireEvent.click(screen.getAllByRole('button', { name: /Details/i })[0])
        await waitFor(() => expect(screen.getByRole('button', { name: /Back to results/i })).toBeInTheDocument())
        fireEvent.click(screen.getByRole('button', { name: /Back to results/i }))

        // Assert
        expect(screen.queryByText(/Paracetamol/)).not.toBeInTheDocument()
        expect(screen.getByText('Panodil')).toBeInTheDocument()
    })

    it('triggers search on Enter key press in the search input', async () => {
        // Arrange
        mockGetByName.mockResolvedValue(sampleProducts)

        // Act
        renderWithChakra(<MedicinePriceSearch />)
        const input = screen.getByPlaceholderText(/e.g. Ibuprofen/i)
        fireEvent.change(input, { target: { value: 'Aspirin' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        // Assert
        await waitFor(() => expect(mockGetByName).toHaveBeenCalledWith('Aspirin'))
    })
})
