import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
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
import Staff from './pages/dashboards/Staff'
import Shifts from './pages/dashboards/Shifts'
import Treatments from './pages/dashboards/Treatments'

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="Contact" element={<Contact />} />
            <Route path="appointment" element={<Appointment />} />

            {/* pages after you have logged in */}
            <Route path='app' element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="departments" element={<Departments />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="missing_medicin" element={<MissingMedicin />} />
              <Route path="patients" element={<Patients />} />
              <Route path="staff" element={<Staff />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="treatment" element={<Treatments />} />
            </Route>
          </Routes>
    
          
        </BrowserRouter>
  )
}

export default App
