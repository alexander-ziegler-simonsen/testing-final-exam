import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { medicinePriceService } = await import('./MedicinePriceService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('medicinePriceService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('getByName builds the correct URL with productName param', async () => {
        mockFetch.mockResolvedValue([])
        await medicinePriceService.getByName('aspirin')
        expect(mockFetch).toHaveBeenCalledWith('/ExternalMedicinePrices/productsByName?productName=aspirin')
    })

    it('getByName URL-encodes spaces in the product name', async () => {
        mockFetch.mockResolvedValue([])
        await medicinePriceService.getByName('pain relief')
        const [url] = mockFetch.mock.calls[0] as [string]
        expect(url).toContain('productName=pain+relief')
    })

    it('getByIngredient builds the correct URL with ingredientName param', async () => {
        mockFetch.mockResolvedValue([])
        await medicinePriceService.getByIngredient('paracetamol')
        expect(mockFetch).toHaveBeenCalledWith('/ExternalMedicinePrices/productsByIngredient?ingredientName=paracetamol')
    })

    it('getByIngredient URL-encodes spaces in the ingredient name', async () => {
        mockFetch.mockResolvedValue([])
        await medicinePriceService.getByIngredient('acetyl salicylic acid')
        const [url] = mockFetch.mock.calls[0] as [string]
        expect(url).toContain('ingredientName=acetyl+salicylic+acid')
    })

    it('getDetails builds the correct URL with productDetailId param', async () => {
        mockFetch.mockResolvedValue({ id: '123', name: 'Aspirin 500mg' })
        await medicinePriceService.getDetails('123')
        expect(mockFetch).toHaveBeenCalledWith('/ExternalMedicinePrices/productDetails?productDetailId=123')
    })
})
