import { describe, it, expect } from 'vitest'
import { buildQueryString } from './tableQuery'

describe('buildQueryString', () => {
    it('returns empty string when called with no arguments', () => {
        expect(buildQueryString()).toBe('')
    })

    it('returns empty string for empty object', () => {
        expect(buildQueryString({})).toBe('')
    })

    it('includes sortBy param', () => {
        expect(buildQueryString({ sortBy: 'name' })).toBe('?sortBy=name')
    })

    it('includes sortDir param', () => {
        expect(buildQueryString({ sortDir: 'desc' })).toBe('?sortDir=desc')
    })

    it('includes both sort params', () => {
        const result = buildQueryString({ sortBy: 'age', sortDir: 'asc' })
        expect(result).toBe('?sortBy=age&sortDir=asc')
    })

    it('includes filter params', () => {
        const result = buildQueryString({ filters: { name: 'John' } })
        expect(result).toBe('?name=John')
    })

    it('omits filter entries with empty string values', () => {
        const result = buildQueryString({ filters: { name: 'John', role: '' } })
        expect(result).toBe('?name=John')
    })

    it('combines sort and filters', () => {
        const result = buildQueryString({
            sortBy: 'name',
            sortDir: 'asc',
            filters: { role: 'doctor' },
        })
        expect(result).toBe('?sortBy=name&sortDir=asc&role=doctor')
    })

    it('URL-encodes special characters in values', () => {
        const result = buildQueryString({ filters: { q: 'hello world' } })
        expect(result).toBe('?q=hello+world')
    })
})
