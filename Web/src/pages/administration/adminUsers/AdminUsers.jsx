import { useState, useEffect } from "react";
import RegisterForm from "../../../components/registerForm/RegisterForm";
import TableUsers from "../../../components/adminComponents/tableUsers/TableUsers";
import NavBar from "../../../components/adminComponents/navBar/NavBar";
import api from "../../../api/api";
import { useAuth } from "../../../hooks/AuthContext";
import "./AdminUsers.css";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false); // nuevo estado para modal

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
    setShowForm(false); // cerrar formulario al refrescar
  };

  return (
    <div className="AdminUsersPage">
      <div className="Encabezado">
        <NavBar />
      </div>

      <div className="ContentWrapper">
        {/* Lista de usuarios */}
        <div className="UserList">
          <h1>Gestión de Usuarios</h1>
          <button
            className="btn-new-user"
            onClick={() => {
              setEditingUser(null); // Nuevo usuario
              setShowForm(true);
            }}
          >
            Nuevo Usuario
          </button>
          <TableUsers
            users={users}
            onEdit={(user) => {
              setEditingUser(user); // Editar usuario
              setShowForm(true);
            }}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Formulario como modal flotante */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* BOTÓN CANCELAR (solo cuando agregas un usuario nuevo) */}
            {editingUser === null && (
              <button
                className="btn-cancel-modal"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            )}

            <RegisterForm
              editingUser={editingUser}
              onSuccess={refreshUsers}
              onCancel={() => setShowForm(false)} // si RegisterForm tiene botón cancelar interno
            />
          </div>
        </div>
      )}
    </div>
  );
}
