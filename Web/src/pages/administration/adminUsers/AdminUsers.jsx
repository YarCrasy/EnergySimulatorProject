import { useState, useEffect } from "react";
import RegisterForm from "../../../components/registerForm/RegisterForm";
import TableUsers from "../../../components/adminComponents/tableUsers/TableUsers";
import NavBar from "../../../components/adminComponents/navBar/NavBar";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/AuthContext"; // <--- Importa
import "./AdminUsers.css";

export default function AdminUsers() {
  const { user: currentUser } = useAuth(); // <--- Usuario logueado
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  const refreshUsers = async () => {
    await loadUsers();
    setEditingUser(null);
  };

  return (
    <div className="AdminUsersPage">
      <div className="Encabezado">
        <NavBar />
      </div>

      <div className="ContentWrapper">
        <div className="UserList">
          <h3>Lista de Usuarios</h3>
          <TableUsers
            users={users}
            onEdit={setEditingUser}
            onDelete={handleDelete}
            currentUser={currentUser} // <--- Pasar el usuario logueado
          />
        </div>

        <div className="FormSection">
          <RegisterForm
            editingUser={editingUser}
            onSuccess={refreshUsers}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      </div>
    </div>
  );
}
