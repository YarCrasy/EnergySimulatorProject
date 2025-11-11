import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

// Importing components
import Header from './components/header/Header'

// Importing page components
import Home from './pages/home/Home'
import NotFound from './pages/not-found/NotFound'
import Simulator from './pages/simulator/Simulator'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import SearchBar from './components/searchBar/SearchBar'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
