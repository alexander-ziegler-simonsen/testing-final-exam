import { describe, it, expect } from 'vitest'
import { buildQueryString } from './tableQuery'

describe('buildQueryString', () => {
    it('returns empty string when called with no arguments', () => {
        // Act
        const result = buildQueryString()

        // Assert
        expect(result).toBe('')
    })

    it('returns empty string for empty object', () => {
        // Act
        const result = buildQueryString({})

        // Assert
        expect(result).toBe('')
    })

    it('includes sortBy param', () => {
        // Act
        const result = buildQueryString({ sortBy: 'name' })

        // Assert
        expect(result).toBe('?sortBy=name')
    })

    it('includes sortDir param', () => {
        // Act
        const result = buildQueryString({ sortDir: 'desc' })

        // Assert
        expect(result).toBe('?sortDir=desc')
    })

    it('includes both sort params', () => {
        // Act
        const result = buildQueryString({ sortBy: 'age', sortDir: 'asc' })

        // Assert
        expect(result).toBe('?sortBy=age&sortDir=asc')
    })

    it('includes filter params', () => {
        // Act
        const result = buildQueryString({ filters: { name: 'John' } })

        // Assert
        expect(result).toBe('?name=John')
    })

    it('omits filter entries with empty string values', () => {
        // Act
        const result = buildQueryString({ filters: { name: 'John', role: '' } })

        // Assert
        expect(result).toBe('?name=John')
    })

    it('combines sort and filters', () => {
        // Act
        const result = buildQueryString({
            sortBy: 'name',
            sortDir: 'asc',
            filters: { role: 'doctor' },
        })

        // Assert
        expect(result).toBe('?sortBy=name&sortDir=asc&role=doctor')
    })

    it('URL-encodes special characters in values', () => {
        // Act
        const result = buildQueryString({ filters: { q: 'hello world' } })

        // Assert
        expect(result).toBe('?q=hello+world')
    })
})
