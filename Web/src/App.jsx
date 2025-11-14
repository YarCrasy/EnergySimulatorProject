import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
    )
}

export default App
