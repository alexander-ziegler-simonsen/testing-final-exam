// @vitest-environment happy-dom
import { vi, describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../test-utils'

vi.mock('../../components/StaffManagement', () => ({ default: () => <div>StaffManagement</div> }))
vi.mock('../../components/DepartmentManagement', () => ({ default: () => <div>DepartmentManagement</div> }))
vi.mock('../../components/ShiftManagement', () => ({ default: () => <div>ShiftManagement</div> }))
vi.mock('../../components/MedicationManagement', () => ({ default: () => <div>MedicationManagement</div> }))
vi.mock('../../components/PrescriptionManagement', () => ({ default: () => <div>PrescriptionManagement</div> }))
vi.mock('../../components/TreatmentStaffManagement', () => ({ default: () => <div>TreatmentStaffManagement</div> }))
vi.mock('../../components/UserManagement', () => ({ default: () => <div>UserManagement</div> }))
vi.mock('../MedicationStoragePage', () => ({ default: () => <div>MedicationStoragePage</div> }))

import AdminDashboard from './AdminDashboard'

describe('AdminDashboard', () => {
    describe('heading', () => {
        it('renders the Admin Dashboard heading', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument()
        })
    })

    describe('tab triggers', () => {
        it('shows the Staff tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Staff' })).toBeInTheDocument()
        })

        it('shows the Departments tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Departments' })).toBeInTheDocument()
        })

        it('shows the Shifts tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Shifts' })).toBeInTheDocument()
        })

        it('shows the Medications tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Medications' })).toBeInTheDocument()
        })

        it('shows the Prescriptions tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Prescriptions' })).toBeInTheDocument()
        })

        it('shows the Treatment Staff tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Treatment Staff' })).toBeInTheDocument()
        })

        it('shows the Users tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Users' })).toBeInTheDocument()
        })

        it('shows the Medication Storage tab', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Medication Storage' })).toBeInTheDocument()
        })
    })

    describe('default tab content', () => {
        it('shows the StaffManagement panel by default', () => {
            // Act
            renderWithProviders(<AdminDashboard />)

            // Assert
            expect(screen.getByText('StaffManagement')).toBeInTheDocument()
        })
    })
})
