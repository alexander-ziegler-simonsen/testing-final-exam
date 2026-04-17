export interface TableQuery {
    sortBy?: string
    sortDir?: 'asc' | 'desc'
    filters?: Record<string, string>
}

export function buildQueryString(q?: TableQuery): string {
    const params = new URLSearchParams()
    if (q?.sortBy)  params.set('sortBy',  q.sortBy)
    if (q?.sortDir) params.set('sortDir', q.sortDir)
    for (const [col, val] of Object.entries(q?.filters ?? {})) {
        if (val) params.set(col, val)
    }
    const s = params.toString()
    return s ? `?${s}` : ''
}
