import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/auth/Login'
import Doctors from './pages/public/Doctors'
import Contact from './pages/public/Contact'
import DashboardLayout from './pages/DashboardLayout'
import Overview from './pages/dashboards/Overview'
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/toaster'
import OneMedicinPage from './pages/dashboards/subPage/medicin/OneMedicinPage'
import MedicinDashboard from './pages/dashboards/MedicinDashboard'
import OneExternalMedicinPage from './pages/dashboards/subPage/medicin/OneExternalMedicinPage'
import OnePatientPage from './pages/dashboards/subPage/patient/OnePatientPage'
import OneTreatmentPage from './pages/dashboards/subPage/patient/OneTreatmentPage'
import FacilityDashboard from './pages/dashboards/FacilityDashboard'
import PatientDashboard from './pages/dashboards/PatientDashboard'
import RoomsDashboard from './pages/dashboards/RoomsDashboard'
import StaffDashboard from './pages/dashboards/StaffDashboard'
import OneRoomPage from './pages/dashboards/subPage/rooms/OneRoomPage'
import OneFacilityPage from './pages/dashboards/subPage/facilities/OneFacilityPage'
import TreatmentDashboard from './pages/dashboards/TreatmentDashboard'

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
            <Route path="treatment" element={<TreatmentDashboard />} />
            <Route path="treatment/:id" element={<OneTreatmentPage />} />

            {/* staff only */}
            <Route element={<RoleProtectedRoute allowedRoles={['doctor', 'nurse', 'admin']} />}>
              {/* Fallback layout - path is '/app' */}
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Overview />} />

              <Route path="facilities" element={<FacilityDashboard />} />
              <Route path="facilities/:id" element={<OneFacilityPage />} />
              <Route path="patients" element={<PatientDashboard />} />
              <Route path="patients/:id" element={<OnePatientPage />} />
              <Route path="medicin" element={<MedicinDashboard />} />
              <Route path="medicin/:id" element={<OneMedicinPage />} />
              <Route path="external_medicin/:id" element={<OneExternalMedicinPage />} />
              <Route path="rooms" element={<RoomsDashboard />} />
              <Route path="staff" element={<StaffDashboard />} />
              <Route path="rooms" element={<RoomsDashboard />} />
              <Route path="rooms/:id" element={<OneRoomPage />} />

              {/* Only admin */}
              {/* <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
                <Route path="staff" element={<Staff />} />
              </Route> */}

              {/* Give Treatment */}
              {/* <Route element={<RoleProtectedRoute allowedRoles={['nurse', 'admin']} />}>
                <Route path="give_treatment" element={<GiveTreatment />} />
              </Route> */}
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
