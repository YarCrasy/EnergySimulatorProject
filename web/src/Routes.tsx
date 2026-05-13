import {
  LazyHome as Home,
  LazyAbout as About,
  LazyLegals as Legals,
  LazyLocations as Locations,
  LazyLogin as Login,
  LazyRegister as Register,
  LazyAdminHome as AdminHome,
  LazyAdminUsers as AdminUsers,
  LazyAdminElements as AdminElements,
  LazyProfile as Profile,
  LazyProjects as Projects,
  LazySimulator as Simulator,
} from "./pages";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/legals", element: <Legals /> },
  { path: "/locations", element: <Locations /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/simulator", element: <Simulator /> },
  { path: "/simulator/:projectId", element: <Simulator /> },
] as const;

export const protectedRoutes = [
  { path: "/dashboard", element: <Projects /> },
  { path: "/projects", element: <Projects /> },
  { path: "/profile", element: <Profile /> },
  { path: "/administration", element: <AdminHome /> },
  { path: "/administration/users", element: <AdminUsers /> },
  { path: "/administration/elements", element: <AdminElements /> },
] as const;

