import Home from "./pages/home/Home";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/about", element: <h1>Sobre nosotros</h1> },
  { path: "/legals", element: <h1>Aviso legal</h1> },
  { path: "/locations", element: <h1>Ubicaciones</h1> },
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
