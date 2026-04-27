import { useState, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const value: AuthContextValue = {
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
