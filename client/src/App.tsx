
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

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<About />} />

          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/locations" element={<LocationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
