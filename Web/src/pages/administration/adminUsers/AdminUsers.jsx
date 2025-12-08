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
  const [showForm, setShowForm] = useState(false);
  const [syncDate, setSyncDate] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setSyncDate(new Date());
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

  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const operators = totalUsers - admins;

  return (
    <main className="admin-users-page">
      <NavBar />

      <section className="admin-users-hero">
        <div>
          <p className="admin-users-eyebrow">Control de accesos</p>
          <h1>Administra las credenciales y perfiles de tu organización</h1>
          <p>
            Mantén los equipos sincronizados, limita roles sensibles y registra nuevos colaboradores desde un único panel seguro.
          </p>
        </div>
        <div className="admin-users-stats">
          <article>
            <span>{totalUsers}</span>
            <p>Usuarios totales</p>
          </article>
          <article>
            <span>{admins}</span>
            <p>Administradores</p>
          </article>
          <article>
            <span>{operators}</span>
            <p>Operadores</p>
          </article>
          <article>
            <span>{syncDate ? syncDate.toLocaleDateString() : "--/--"}</span>
            <p>Última sincronización</p>
          </article>
        </div>
      </section>

      <section className="admin-users-content">
        <header>
          <div>
            <h2>Usuarios registrados</h2>
            <p>Consulta accesos actuales, edita permisos o elimina cuentas inactivas.</p>
          </div>
          <button
            className="btn-new-user"
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
          >
            Nuevo usuario
          </button>
        </header>

        <div className="admin-users-table">
          <TableUsers
            users={users}
            onEdit={(user) => {
              setEditingUser(user);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        </div>
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {editingUser === null && (
              <button className="btn-cancel-modal" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            )}
            <RegisterForm editingUser={editingUser} onSuccess={refreshUsers} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
