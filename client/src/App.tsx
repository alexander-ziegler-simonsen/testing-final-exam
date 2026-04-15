
import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/Login"
import './App.css'
import PatientDashboard from "./pages/patient/PatientDashboard"
import DoctorDashboard from "./pages/doctor/DoctorDashboard"
import NurseDashboard from "./pages/nurse/NurseDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"
import About from "./pages/About"
import LocationsPage from "./pages/LocationPage"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          {/* Public routes — no login required */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<About />} />

          {/* Doctor only */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
          </Route>

          {/* Nurse only */}
          <Route element={<ProtectedRoute allowedRoles={["nurse"]} />}>
            <Route path="/nurse" element={<NurseDashboard />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/locations" element={<LocationsPage />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
