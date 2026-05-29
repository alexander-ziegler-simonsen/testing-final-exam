// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { screen } from '../test-utils'
import { renderWithChakra } from '../test-utils'
import MedicationStorageTable from './MedicationStorageTable'
import type { Medication } from '../entites/Medication'
import type { MedicationStorage } from '../entites/MedicationStorage'

const medications: Medication[] = [
    { id: 1, name: 'Aspirin' },
    { id: 2, name: 'Ibuprofen' },
]

const storages: MedicationStorage[] = [
    { id: 10, fkMedicationId: 1, amount: 50 },
    { id: 11, fkMedicationId: 2, amount: 20 },
]

describe('MedicationStorageTable', () => {
    it('shows the empty-state message when storages is empty', () => {
        // Act
        renderWithChakra(<MedicationStorageTable storages={[]} medications={medications} />)

        // Assert
        expect(screen.getByText('No storage entries found.')).toBeInTheDocument()
    })

    it('does not render a table when storages is empty', () => {
        // Act
        renderWithChakra(<MedicationStorageTable storages={[]} medications={medications} />)

        // Assert
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('renders one row per storage entry (plus the header row)', () => {
        // Act
        renderWithChakra(<MedicationStorageTable storages={storages} medications={medications} />)

        // Assert
        expect(screen.getAllByRole('row')).toHaveLength(3)
    })

    it('displays the storage id in each row', () => {
        // Act
        renderWithChakra(<MedicationStorageTable storages={storages} medications={medications} />)

        // Assert
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('11')).toBeInTheDocument()
    })

    it('displays the medication name resolved from the medications list', () => {
        // Act
        renderWithChakra(<MedicationStorageTable storages={storages} medications={medications} />)

        // Assert
        expect(screen.getByText('Aspirin')).toBeInTheDocument()
        expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
    })

    it('falls back to "Medication #id" when the medication id is not found', () => {
        // Arrange
        const unknownStorage: MedicationStorage[] = [{ id: 99, fkMedicationId: 999, amount: 5 }]

        // Act
        renderWithChakra(<MedicationStorageTable storages={unknownStorage} medications={medications} />)

        // Assert
        expect(screen.getByText('Medication #999')).toBeInTheDocument()
    })

    it('displays the amount in stock for each entry', () => {
        // Act
        renderWithChakra(<MedicationStorageTable storages={storages} medications={medications} />)

        // Assert
        expect(screen.getByText('50')).toBeInTheDocument()
        expect(screen.getByText('20')).toBeInTheDocument()
    })
})
