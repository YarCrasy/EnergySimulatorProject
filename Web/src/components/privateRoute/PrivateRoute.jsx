import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
//mientras se carga la autenticación, no renderizamos nada
  if (loading) return null; 

  return user ? children : <Navigate to="/login" replace />;
}
