import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

interface PrivateRouteProps {
  children: ReactNode;
  role?: "admin" | "user";
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { user, loading } = useAuth();
//mientras se carga la autenticación, no renderizamos nada
  if (loading) return null; 

//si no hay usuario logeado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  //si se especifica un rol y el usuario no tiene ese rol
  if (role && user.role !== role) {
    return <Navigate to="/" replace />; 
  }
  return <>{children}</>
}
