import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/auth/Login'
import Doctors from './pages/public/Doctors'
import Contact from './pages/public/Contact'
import Appointment from './pages/public/Appointment'

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
          </Routes>
    
          {/* <Route path="concerts">
            <Route index element={<ConcertsHome />} />
            <Route path=":city" element={<City />} />
            <Route path="trending" element={<Trending />} />
          </Route> */}
        </BrowserRouter>
  )
}

export default App
