import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Legals from "./pages/legals/Legals";
import Locations from "./pages/locations/Locations";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/legals", element: <Legals /> },
  { path: "/locations", element: <Locations /> },
  { path: "/login", element: <h1>Iniciar sesión</h1> },
  { path: "/register", element: <h1>Registro</h1> },
] as const;

export const protectedRoutes = [
  { path: "/dashboard", element: <h1>Dashboard</h1> },
  { path: "/projects", element: <h1>Proyectos</h1> },
  { path: "/simulator", element: <h1>Simulador</h1> },
  { path: "/simulator/:projectId", element: <h1>Proyecto del simulador</h1> },
  { path: "/profile", element: <h1>Perfil</h1> },
  { path: "/administration/users", element: <h1>Administración de usuarios</h1> },
  { path: "/administration/elements", element: <h1>Administración de elementos</h1> },
] as const;
