import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { medicinePriceService } = await import('./MedicinePriceService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('medicinePriceService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getByName', () => {
        it('calls GET /ExternalMedicinePrices/productsByName with productName param', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await medicinePriceService.getByName('aspirin')

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/ExternalMedicinePrices/productsByName?productName=aspirin'
            )
        })

        it('URL-encodes spaces in the product name', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await medicinePriceService.getByName('pain relief')

            // Assert
            const [url] = mockFetch.mock.calls[0] as [string]
            expect(url).toContain('productName=pain+relief')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ productId: '1', productName: 'Aspirin 500mg' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await medicinePriceService.getByName('aspirin')

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getByIngredient', () => {
        it('calls GET /ExternalMedicinePrices/productsByIngredient with ingredientName param', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await medicinePriceService.getByIngredient('paracetamol')

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/ExternalMedicinePrices/productsByIngredient?ingredientName=paracetamol'
            )
        })

        it('URL-encodes special characters in the ingredient name', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await medicinePriceService.getByIngredient('acetyl salicylic acid')

            // Assert
            const [url] = mockFetch.mock.calls[0] as [string]
            expect(url).toContain('ingredientName=acetyl+salicylic+acid')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ productId: '2', productName: 'Paracetamol 500mg' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await medicinePriceService.getByIngredient('paracetamol')

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getDetails', () => {
        it('calls GET /ExternalMedicinePrices/productDetails with productDetailId param', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: '123', name: 'Aspirin 500mg' })

            // Act
            await medicinePriceService.getDetails('123')

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/ExternalMedicinePrices/productDetails?productDetailId=123'
            )
        })

        it('returns the detail from apiFetch', async () => {
            // Arrange
            const detail = { id: '456', name: 'Ibuprofen 400mg', price: 29.99 }
            mockFetch.mockResolvedValue(detail)

            // Act
            const result = await medicinePriceService.getDetails('456')

            // Assert
            expect(result).toEqual(detail)
        })
    })
})
