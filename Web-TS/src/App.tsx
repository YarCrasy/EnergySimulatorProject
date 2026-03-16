import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import usePortraitOrientation from "./hooks/usePortraitOrientation";
import "./App.css";

import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Spiner from "./components/spiner/Spiner";

// Pages
import Home from "./pages/home/Home";
import Projects from "./pages/projects/Projects";
import NotFound from "./pages/not-found/NotFound";
import Register from "./pages/register/Register";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Legals from "./pages/legals/Legals";

import ForceOrientationHTML from "./components/forceOrientation/ForceOrientation";

// Lazy-loaded routes for code-splitting (secondary routes with heavy dependencies)
const Mapa = lazy(() => import("./pages/locations/Locations"));
const Simulator = lazy(() => import("./pages/simulator/Simulator"));
const AdminUsers = lazy(() => import("./pages/administration/adminUsers/AdminUsers"));
const AdminElements = lazy(() => import("./pages/administration/adminElements/AdminElements"));

// Fallback component for lazy loading
const LazyFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <Spiner text="Cargando..." />
  </div>
);

function App() {
  const hidePaths = ["/simulator", "/login", "/register", "/administration"];
  const isPortrait = usePortraitOrientation();

  const HeaderWrapper = () => {
    const location = useLocation();
    const isHidden = hidePaths.some((p) => location.pathname.startsWith(p));
    return isHidden ? null : <Header />;
  };

  const FooterWrapper = () => {
    const location = useLocation();
    const shouldHide = location.pathname.startsWith("/simulator");
    return shouldHide ? null : <Footer />;
  };

  const BrowserRouterHTML = () => {
    return (
      <BrowserRouter>
        <div className="app-layout">
          <HeaderWrapper />
          <div className="content">
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/legals" element={<Legals />} />
              <Route path="/locations" element={<Suspense fallback={<LazyFallback />}><Mapa /></Suspense>} />
              <Route path="/about" element={<About />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* RUTAS PROTEGIDAS */}
              <Route
                path="/projects"
                element={
                  <PrivateRoute>
                    <Projects />
                  </PrivateRoute>
                }
              />

              <Route
                path="/simulator"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LazyFallback />}>
                      <Simulator />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/simulator/:projectId"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LazyFallback />}>
                      <Simulator />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/administration/users"
                element={
                  <PrivateRoute role="admin">
                    <Suspense fallback={<LazyFallback />}>
                      <AdminUsers />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/administration/receivers"
                element={
                  <PrivateRoute role="admin">
                    <Suspense fallback={<LazyFallback />}>
                      <AdminElements />
                    </Suspense>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>

          <FooterWrapper />
        </div>
      </BrowserRouter>
    );
  };

  return <>{isPortrait ? <ForceOrientationHTML /> : <BrowserRouterHTML />}</>;
}

export default App;
