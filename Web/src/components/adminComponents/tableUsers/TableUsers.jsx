import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useAuth } from "../../../hooks/AuthContext";
import "./TableUsers.css";

export default function TableUsers({ onEdit }) {
  const [users, setUsers] = useState([]);
  const { user } = useAuth(); // para saber si es admin

  // === CARGA SIMPLE DE USUARIOS ===
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/user");
        setUsers(res.data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };
    load();
  }, []);

  // === ELIMINAR ===
  const deleteUser = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Nacimiento</th>
          {user?.role === "admin" && <th>Acciones</th>}
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.birthdate}</td>

            {user?.role === "admin" && (
              <td>
                <button onClick={() => onEdit(u)}>Editar</button>
                <button onClick={() => deleteUser(u.id)}>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
