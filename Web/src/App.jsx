import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import usePortraitOrientation from './hooks/usePortraitOrientation'
import './App.css'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'

// Importing page components
import Home from './pages/home/Home'
import Simulator from './pages/simulator/Simulator'
import Projects from './pages/projects/Projects'
import Contact from './pages/contact/Contact'
import NotFound from './pages/not-found/NotFound'
import Register from './pages/register/Register'
import Mapa from './pages/locations/Locations'
import About from './pages/about/About'
import Login from './pages/login/Login'

function App() {
  const hidePaths = ['/simulator', '/projects', '/register', '/login']

  const HeaderWrapper = () => {
    const location = useLocation()
    const isHidden = hidePaths.some(p => location.pathname.startsWith(p))
    return isHidden ? null : <Header />
  }

  const isPortraitSmall = usePortraitOrientation(600)

  const ForceOrientationHTML = () => {
    return (
      <div className="force-orientation">
        <h2>Por favor, gira tu dispositivo para una mejor experiencia.</h2>
      </div>
    );
  }

  const BrowserRouterHTML = () => {
    return (
      <BrowserRouter>
        <HeaderWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path='/locations' element={<Mapa />} />
          <Route path ="/about" element ={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
  }

  return (
    <>
      {isPortraitSmall ? <ForceOrientationHTML /> : <BrowserRouterHTML />}
    </>
  )
}

export default App
