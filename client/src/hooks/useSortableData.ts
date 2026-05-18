import { useState, useEffect, useRef } from 'react'
import type { TableQuery } from '../services/tableQuery'

export interface SortableData<T> {
    data: T[]
    // setData lets callers mutate the local list after an edit/delete without re-fetching from the API
    setData: React.Dispatch<React.SetStateAction<T[]>>
    loading: boolean
    error: string | null
    sortBy: string
    sortDir: 'asc' | 'desc'
    onSort: (col: string) => void
    filters: Record<string, string>
    setFilter: (col: string, value: string) => void
}

export function useSortableData<T>(
    fetcher: (query: TableQuery) => Promise<T[]>,
    defaultSortBy = 'id'
): SortableData<T> {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState(defaultSortBy)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>({})

    const fetcherRef = useRef(fetcher)
    const isFirstRender = useRef(true)
    fetcherRef.current = fetcher

    // Debounce filter changes — skip on first render so we don't double-fetch on mount
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const timer = setTimeout(() => setDebouncedFilters(filters), 300)
        return () => clearTimeout(timer)
    }, [filters])

    // Re-fetch when debounced filters or sort state changes
    useEffect(() => {
        setLoading(true)
        setError(null)
        fetcherRef.current({ sortBy, sortDir, filters: debouncedFilters })
            .then(setData)
            .catch(() => setError('Failed to load data'))
            .finally(() => setLoading(false))
    }, [debouncedFilters, sortBy, sortDir])

    function onSort(col: string) {
        if (col === sortBy) {
            setSortDir(dir => dir === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(col)
            setSortDir('asc')
        }
    }

    function setFilter(col: string, value: string) {
        setFilters(prev => ({ ...prev, [col]: value }))
    }

    return { data, setData, loading, error, sortBy, sortDir, onSort, filters, setFilter }
}
