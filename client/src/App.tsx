import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/auth/Login'
import Doctors from './pages/public/Doctors'
import Contact from './pages/public/Contact'
import Appointment from './pages/public/Appointment'
import DashboardLayout from './pages/DashboardLayout'
import Overview from './pages/dashboards/Overview'
import Departments from './pages/dashboards/Departments'
import DepartmentStaff from './pages/dashboards/DepartmentStaff'
import Facilities from './pages/dashboards/Facilities'
import OneFacility from './pages/dashboards/OneFacility'
import MissingMedicin from './pages/dashboards/MissingMedicin'
import MedicinStorage from './pages/dashboards/MedicinStorage'
import OneMedicin from './pages/dashboards/OneMedicin'
import ExternalMedicin from './pages/dashboards/ExternalMedicin'
import OneExternalMedicin from './pages/dashboards/OneExternalMedicin'
import Patients from './pages/dashboards/Patients'
import OnePatient from './pages/dashboards/OnePatient'
import Staff from './pages/dashboards/Staff'
import Shifts from './pages/dashboards/Shifts'
import RoomBooking from './pages/dashboards/RoomBooking'
import OneRoomBooking from './pages/dashboards/OneRoomBooking'
import OneRoom from './pages/dashboards/OneRoom'
import Treatments from './pages/dashboards/Treatments'
import OneTreatment from './pages/dashboards/OneTreatment'
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Landing Pages */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="Contact" element={<Contact />} />
        <Route path="appointment" element={<Appointment />} />

        {/* 🔒 BASE PROTECTION: Enforces that a user is actively authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<DashboardLayout />}>

            {/* Accessible by Everyone (Staff AND Patients) */}
            <Route path="treatment" element={<Treatments />} />
            <Route path="treatment/:id" element={<OneTreatment />} />

            {/* 🩺 STAFF ONLY BOUNDARY: Patients are completely blocked from this nested route tree */}
            <Route element={<RoleProtectedRoute allowedRoles={['doctor', 'nurse', 'admin']} />}>
              {/* Fallback layout: Redirect base /app down to the Overview page */}
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="departments" element={<Departments />} />
              <Route path="department_staff" element={<DepartmentStaff />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="facilities/:id" element={<OneFacility />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<OnePatient />} />
              <Route path="missing_medicin" element={<MissingMedicin />} />
              <Route path="medicin_storage" element={<MedicinStorage />} />
              <Route path="medicin_storage/:id" element={<OneMedicin />} />
              <Route path="external_medicin" element={<ExternalMedicin />} />
              <Route path="external_medicin/:id" element={<OneExternalMedicin />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="room_booking" element={<RoomBooking />} />
              <Route path="room_booking/room/:id" element={<OneRoom />} />
              <Route path="room_booking/:id" element={<OneRoomBooking />} />

              {/* 🛠️ ULTRA-RESTRICTED: Only admin accounts can clear staff settings */}
              <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
                <Route path="staff" element={<Staff />} />
              </Route>
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
