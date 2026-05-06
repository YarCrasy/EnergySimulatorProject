import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Legals from "./pages/legals/Legals";
import Locations from "./pages/locations/Locations";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/adminUsers/AdminUsers";
import AdminElements from "./pages/admin/adminElements/AdminElements";
import Profile from "./pages/profile/Profile";
import Projects from "./pages/projects/Projects";
import Simulator from "./pages/simulator/Simulator";

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

