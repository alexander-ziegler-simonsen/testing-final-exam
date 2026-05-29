import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { patientService } = await import('./PatientService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('patientService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /patient with no query string when called with no args', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await patientService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/patient')
        })

        it('appends sortBy param', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await patientService.getAll({ sortBy: 'name' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/patient?sortBy=name')
        })

        it('appends sortDir param', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await patientService.getAll({ sortDir: 'desc' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/patient?sortDir=desc')
        })

        it('appends filter params', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await patientService.getAll({ filters: { name: 'Alice' } })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/patient?name=Alice')
        })

        it('combines sort and filter params', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await patientService.getAll({ sortBy: 'name', sortDir: 'asc', filters: { name: 'Alice' } })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/patient?sortBy=name&sortDir=asc&name=Alice')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, firstname: 'Alice', lastname: 'Smith' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await patientService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /patient/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 3 })

            // Act
            await patientService.getById(3)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/patient/3')
        })

        it('returns the item from apiFetch', async () => {
            // Arrange
            const patient = { id: 5, firstname: 'Bob', lastname: 'Jones' }
            mockFetch.mockResolvedValue(patient)

            // Act
            const result = await patientService.getById(5)

            // Assert
            expect(result).toEqual(patient)
        })
    })
})
