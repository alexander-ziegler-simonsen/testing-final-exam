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
import Facilities from './pages/dashboards/Facilities'
import MissingMedicin from './pages/dashboards/MissingMedicin'
import Patients from './pages/dashboards/Patients'
import OnePatient from './pages/dashboards/OnePatient'
import Staff from './pages/dashboards/Staff'
import Shifts from './pages/dashboards/Shifts'
import Treatments from './pages/dashboards/Treatments'
import OneTreatment from './pages/dashboards/OneTreatment'
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
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
              <Route path="facilities" element={<Facilities />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<OnePatient />} />
              <Route path="missing_medicin" element={<MissingMedicin />} />
              <Route path="shifts" element={<Shifts />} />

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
