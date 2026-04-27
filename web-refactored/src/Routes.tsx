import Home from "./pages/home/Home";

const routePage = (title: string, description?: string) => (
  <main className="route-page">
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  </main>
);

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/about", element: routePage("Sobre nosotros", "Conoce la propuesta y el equipo del simulador.") },
  { path: "/legals", element: routePage("Aviso legal", "Información legal y condiciones de uso.") },
  { path: "/locations", element: routePage("Ubicaciones", "Explora los puntos de interés de tus proyectos.") },
  { path: "/login", element: routePage("Iniciar sesión", "Accede para gestionar proyectos y simulaciones.") },
  { path: "/register", element: routePage("Registro", "Crea tu cuenta para empezar a simular.") },
] as const;

export const protectedRoutes = [
  { path: "/dashboard", element: routePage("Dashboard", "Resumen general de tu actividad.") },
  { path: "/projects", element: routePage("Proyectos", "Lista y gestión de proyectos activos.") },
  { path: "/simulator", element: routePage("Simulador", "Espacio de trabajo principal.") },
  { path: "/simulator/:projectId", element: routePage("Proyecto del simulador", "Detalle de una simulación concreta.") },
  { path: "/profile", element: routePage("Perfil", "Datos de tu usuario y preferencias.") },
  { path: "/administration/users", element: routePage("Administración de usuarios", "Gestión de cuentas y permisos.") },
  { path: "/administration/elements", element: routePage("Administración de elementos", "Configuración de catálogos y recursos.") },
] as const;
