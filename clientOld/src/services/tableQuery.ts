export interface TableQuery {
    sortBy?: string
    sortDir?: 'asc' | 'desc'
    filters?: Record<string, string>
}

export function buildQueryString(query?: TableQuery): string {
    const params = new URLSearchParams()
    if (query?.sortBy) params.set('sortBy', query.sortBy)
    if (query?.sortDir) params.set('sortDir', query.sortDir)
    for (const [col, val] of Object.entries(query?.filters ?? {})) {
        if (val) params.set(col, val)
    }
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
}
