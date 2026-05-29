// @vitest-environment happy-dom
import { vi, describe, it, expect } from 'vitest'
import { screen, fireEvent } from '../test-utils'
import { renderWithChakra } from '../test-utils'
import { Table } from '@chakra-ui/react'
import SortHeader from './SortHeader'

function renderSortHeader(overrides: {
    col?: string
    label?: string
    sortBy?: string
    sortDir?: 'asc' | 'desc'
    onSort?: (col: string) => void
    filterValue?: string
    onFilter?: (col: string, value: string) => void
} = {}) {
    const props = {
        col: 'name',
        label: 'Name',
        sortBy: '',
        sortDir: 'asc' as const,
        onSort: vi.fn(),
        ...overrides,
    }
    // Table.ColumnHeader is a Chakra slot recipe component — it must live inside Table.Root
    return renderWithChakra(
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <SortHeader {...props} />
                </Table.Row>
            </Table.Header>
        </Table.Root>
    )
}

describe('SortHeader', () => {
    describe('sort indicator', () => {
        it('shows ↕ when the column is not the active sort column', () => {
            // Act
            renderSortHeader({ col: 'name', sortBy: 'age' })

            // Assert
            expect(screen.getByRole('columnheader')).toHaveTextContent('Name ↕')
        })

        it('shows ↑ when the column is active and sortDir is asc', () => {
            // Act
            renderSortHeader({ col: 'name', sortBy: 'name', sortDir: 'asc' })

            // Assert
            expect(screen.getByRole('columnheader')).toHaveTextContent('Name ↑')
        })

        it('shows ↓ when the column is active and sortDir is desc', () => {
            // Act
            renderSortHeader({ col: 'name', sortBy: 'name', sortDir: 'desc' })

            // Assert
            expect(screen.getByRole('columnheader')).toHaveTextContent('Name ↓')
        })
    })

    describe('sort click', () => {
        it('calls onSort with the column key when the header is clicked', () => {
            // Arrange
            const onSort = vi.fn()
            renderSortHeader({ col: 'email', label: 'Email', onSort })

            // Act
            fireEvent.click(screen.getByText(/Email/))

            // Assert
            expect(onSort).toHaveBeenCalledWith('email')
        })

        it('calls onSort with the exact column key passed in', () => {
            // Arrange
            const onSort = vi.fn()
            renderSortHeader({ col: 'createdAt', label: 'Created', onSort })

            // Act
            fireEvent.click(screen.getByText(/Created/))

            // Assert
            expect(onSort).toHaveBeenCalledExactlyOnceWith('createdAt')
        })
    })

    describe('filter input', () => {
        it('does not render the filter input when onFilter is not provided', () => {
            // Act
            renderSortHeader({ onFilter: undefined })

            // Assert
            expect(screen.queryByPlaceholderText('Search…')).not.toBeInTheDocument()
        })

        it('renders the filter input when onFilter is provided', () => {
            // Act
            renderSortHeader({ onFilter: vi.fn(), filterValue: '' })

            // Assert
            expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
        })

        it('displays the current filterValue in the input', () => {
            // Act
            renderSortHeader({ onFilter: vi.fn(), filterValue: 'alice' })

            // Assert
            expect(screen.getByPlaceholderText('Search…')).toHaveValue('alice')
        })

        it('calls onFilter with col and the new value on change', () => {
            // Arrange
            const onFilter = vi.fn()
            renderSortHeader({ col: 'name', onFilter, filterValue: '' })

            // Act
            fireEvent.change(screen.getByPlaceholderText('Search…'), {
                target: { value: 'Bob' },
            })

            // Assert
            expect(onFilter).toHaveBeenCalledWith('name', 'Bob')
        })
    })
})
