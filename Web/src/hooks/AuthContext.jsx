import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// Datos de usuario falso para simular login/logout
const usersDB = [
  {
    id: 1,
    email: "juan@email.com",
    password: "1234",
    name: "Juan",
    role: "user",
  },
  {
    id: 2,
    email: "ana@email.com",
    password: "abcd",
    name: "Ana",
    role: "user",
  },
  {
    id: 3,
    email: "natalyipiales@gmail.com",
    password: "111",
    name: "Nataly",
    role: "user",
  },
  {
    id: 4,
    email: "nat@gmail.com",
    password: "111",
    name: "Nataly11",
    role: "admin",
  },
  {
    id: 5,
    email: "123@testing.com",
    password: "123",
    name: "123",
    role: "admin",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Guardar sesión cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth:user");
    }
  }, [user]);

  // Login "fake" usando la DB de prueba
  async function login(email, password) {
    if (!email || !password) {
      throw new Error("Credenciales inválidas");
    }

    const foundUser = usersDB.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    // Guardamos solo lo necesario en el context y localStorage
    const { id, name, role } = foundUser;
    setUser({ id, name, role });

    return { id, name, role };
  }

  // Logout
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook para acceder al contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}
