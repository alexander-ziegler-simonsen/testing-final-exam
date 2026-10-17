import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/auth/Login'
import Doctors from './pages/public/Doctors'
import Contact from './pages/public/Contact'
import DashboardLayout from './pages/DashboardLayout'
import Overview from './pages/dashboards/Overview'
import Departments from './pages/dashboards/facilities/Departments'
import DepartmentStaff from './pages/dashboards/facilities/DepartmentStaff'
import Facilities from './pages/dashboards/facilities/Facilities'
import OneFacility from './pages/dashboards/subPages/OneFacility'
import MissingMedicin from './pages/dashboards/medicin/MissingMedicin'
import MedicinStorage from './pages/dashboards/medicin/MedicinStorage'
import OneMedicin from './pages/dashboards/subPages/OneMedicin'
import ExternalMedicin from './pages/dashboards/medicin/ExternalMedicin'
import OneExternalMedicin from './pages/dashboards/subPages/OneExternalMedicin'
import OnePatient from './pages/dashboards/subPages/OnePatient'
import RegisterBaby from './pages/dashboards/patient/RegisterBaby'
import Staff from './pages/dashboards/staff/Staff'
import RoomBooking from './pages/dashboards/rooms/RoomBooking'
import OneRoomBooking from './pages/dashboards/subPages/OneRoomBooking'
import OneRoom from './pages/dashboards/subPages/OneRoom'
import Treatments from './pages/dashboards/patient/Treatments'
import OneTreatment from './pages/dashboards/subPages/OneTreatment'
import GiveTreatment from './pages/dashboards/patient/GiveTreatment'
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/toaster'
import Patients from './pages/dashboards/patient/Patients'

// https://mswjs.io/docs/integrations/browser/#conditionally-enable-mocking
function MockingNotice() {
  const location = useLocation()

  useEffect(() => {
    if (import.meta.env.VITE_API_MOCKING !== 'disabled') {
      console.log(`[msw] mocking (${import.meta.env.VITE_API_MOCKING}) — page: ${location.pathname}`)
    }
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <MockingNotice />
      <Toaster />
      <Routes>
        {/* the public site */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="Contact" element={<Contact />} />

        {/* Enforces user authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<DashboardLayout />}>

            {/* Accessible by Everyone (Staff AND Patients) */}
            <Route path="treatment" element={<Treatments />} />
            <Route path="treatment/:id" element={<OneTreatment />} />

            {/* staff only */}
            <Route element={<RoleProtectedRoute allowedRoles={['doctor', 'nurse', 'admin']} />}>
              {/* Fallback layout - path is '/app' */}
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Overview />} />

              <Route path="departments" element={<Departments />} />
              <Route path="department_staff" element={<DepartmentStaff />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="facilities/:id" element={<OneFacility />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<OnePatient />} />
              <Route path="register_baby" element={<RegisterBaby />} />
              <Route path="missing_medicin" element={<MissingMedicin />} />
              <Route path="medicin_storage" element={<MedicinStorage />} />
              <Route path="medicin_storage/:id" element={<OneMedicin />} />
              <Route path="external_medicin" element={<ExternalMedicin />} />
              <Route path="external_medicin/:id" element={<OneExternalMedicin />} />
              <Route path="room_booking" element={<RoomBooking />} />
              <Route path="room_booking/room/:id" element={<OneRoom />} />
              <Route path="room_booking/:id" element={<OneRoomBooking />} />

              {/* Only admin */}
              <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
                <Route path="staff" element={<Staff />} />
              </Route>

              {/* Give Treatment */}
              <Route element={<RoleProtectedRoute allowedRoles={['nurse', 'admin']} />}>
                <Route path="give_treatment" element={<GiveTreatment />} />
              </Route>
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
