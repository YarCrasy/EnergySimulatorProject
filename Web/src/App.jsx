import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import usePortraitOrientation from './hooks/usePortraitOrientation'
import './App.css'

import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import PrivateRoute from './components/privateRoute/PrivateRoute'

// Pages
import Home from './pages/home/Home'
import Simulator from './pages/simulator/Simulator'
import Projects from './pages/projects/Projects'
import Contact from './pages/contact/Contact'
import NotFound from './pages/not-found/NotFound'
import Register from './pages/register/Register'
import Mapa from './pages/locations/Locations'
import About from './pages/about/About'
import Login from './pages/login/Login'
import ForceOrientationHTML from './components/forceOrientation/ForceOrientation'

import AdminUsers from './pages/administration/adminUsers/AdminUsers'
function App() {
  const hidePaths = ['/simulator', '/projects', '/login', '/register']

  const HeaderWrapper = () => {
    const location = useLocation()
    const isHidden = hidePaths.some(p => location.pathname.startsWith(p))
    return isHidden ? null : <Header />
  }

  const BrowserRouterHTML = () => {
    return (
      <BrowserRouter>
        <HeaderWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path='/locations' element={<Mapa />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* RUTAS PROTEGIDAS */}
          <Route path="/projects" element={<PrivateRoute> <Projects /></PrivateRoute>} />

          <Route path="/simulator" element={<PrivateRoute><Simulator /></PrivateRoute>} />
          {/* Solo admin */}
          <Route path="/administration/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
  }

  return (
    <>
      {usePortraitOrientation() ? <ForceOrientationHTML /> : <BrowserRouterHTML />}
    </>
  )
}

export default App
