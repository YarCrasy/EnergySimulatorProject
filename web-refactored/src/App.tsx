import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "./auth/auth";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Spinner from "./components/spiner/Spiner";
import NotFound from "./pages/not-found/NotFound";
import { protectedRoutes, publicRoutes } from "./Routes";
import "./App.css";

function App() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const hiddenHeaderPaths = ["/login", "/register", "/simulator", "/administration"];
  const hiddenFooterPaths = ["/login", "/register", "/simulator", "/administration"];
  const protectedRouteElement = loading ? (<Spinner text="Cargando sesion..." />) : isAuthenticated ? ( <Outlet /> ) : ( <Navigate to="/login" replace state={{ from: location }} /> );
  const hideHeader = hiddenHeaderPaths.some((path) => location.pathname.startsWith(path));
  const hideFooter = hiddenFooterPaths.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>

        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={protectedRouteElement}>
          {protectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
