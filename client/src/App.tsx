import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/auth/Login'
import Doctors from './pages/public/Doctors'
import Contact from './pages/public/Contact'
import DashboardLayout from './pages/DashboardLayout'
import Overview from './pages/dashboardsOld/Overview'
import Departments from './pages/dashboardsOld/Departments'
import DepartmentStaff from './pages/dashboardsOld/DepartmentStaff'
import Facilities from './pages/dashboardsOld/Facilities'
import OneFacility from './pages/dashboardsOld/OneFacility'
import Patients from './pages/dashboardsOld/Patients'
import OnePatient from './pages/dashboardsOld/OnePatient'
import RegisterBaby from './pages/dashboardsOld/RegisterBaby'
import Staff from './pages/dashboardsOld/Staff'
import RoomBooking from './pages/dashboardsOld/RoomBooking'
import OneRoomBooking from './pages/dashboardsOld/OneRoomBooking'
import OneRoom from './pages/dashboardsOld/OneRoom'
import Treatments from './pages/dashboardsOld/Treatments'
import OneTreatment from './pages/dashboardsOld/OneTreatment'
import GiveTreatment from './pages/dashboardsOld/GiveTreatment'
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/toaster'
import OneMedicinPage from './pages/dashboards/subPage/OneMedicinPage'
import MedicinDashboard from './pages/dashboards/MedicinDashboard'
import OneExternalMedicinPage from './pages/dashboards/subPage/OneExternalMedicinPage'

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
              <Route path="medicin" element={<MedicinDashboard />} />
              <Route path="medicin/:id" element={<OneMedicinPage />} />
              <Route path="external_medicin/:id" element={<OneExternalMedicinPage />} />
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
