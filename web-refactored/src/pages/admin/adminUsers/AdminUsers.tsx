import { useEffect, useMemo, useState } from "react";
import { FaPencilAlt, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import { Navigate } from "react-router-dom";

import { deleteUser, getAllUsers, type UserProfile } from "@api/users";
import { useAuth } from "@auth/auth";
import RegisterForm from "@components/registerForm/RegisterForm";
import type { EditableUser } from "@components/registerForm/types";
import type { Identifier } from "@models/common";
import "../AdminBase.css";

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);

  const userStats = useMemo(() => {
    const adminCount = users.filter((item) => item.admin || item.role === "admin").length;
    return { total: users.length, admins: adminCount, operators: users.length - adminCount };
  }, [users]);

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const userData = await getAllUsers();
        if (mounted) setUsers(userData);
      } catch (loadError) {
        console.error("No se pudieron cargar los usuarios", loadError);
        if (mounted) setError("No se pudieron cargar los usuarios.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  if (user?.role !== "admin") {
    return <Navigate to="/projects" replace />;
  }

  const closeUserModal = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const openCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const openEditUser = (selected: UserProfile) => {
    setEditingUser({
      id: selected.id ?? undefined,
      fullName: selected.fullName ?? selected.name ?? "",
      dateOfBirth: selected.dateOfBirth ?? "",
      email: selected.email ?? "",
    });
    setShowUserForm(true);
  };

  const refreshUsers = async () => {
    const next = await getAllUsers();
    setUsers(next);
    closeUserModal();
  };

  const handleDeleteUser = async (id: Identifier | null | undefined) => {
    if (id == null) return;
    if (String(user?.id ?? "") === String(id)) {
      window.alert("No puedes eliminar tu propio usuario desde este panel.");
      return;
    }
    if (!window.confirm("Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      setUsers((current) => current.filter((item) => String(item.id) !== String(id)));
    } catch (deleteError) {
      console.error("No se pudo eliminar el usuario", deleteError);
      window.alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">administración</p>
        <h1>Usuarios</h1>
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <section className="admin-stats">
              <article>
                <span>{userStats.total}</span>
                <p>Usuarios</p>
              </article>
              <article>
                <span>{userStats.admins}</span>
                <p>Admins</p>
              </article>
              <article>
                <span>{userStats.operators}</span>
                <p>Operadores</p>
              </article>
            </section>

            <div className="admin-toolbar">
              <h2>Gestión de usuarios</h2>
              <button type="button" className="admin-btn primary" onClick={openCreateUser}>
                <FaPlus aria-hidden="true" />
                Nuevo usuario
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={String(item.id ?? item.email)}>
                      <td>
                        <FaUsers aria-hidden="true" />
                        {item.fullName || item.name || "Sin nombre"}
                      </td>
                      <td>{item.email ?? "Sin correo"}</td>
                      <td>{item.admin ? "Admin" : item.role ?? "Usuario"}</td>
                      <td className="admin-actions">
                        <button type="button" className="admin-btn" onClick={() => openEditUser(item)}>
                          <FaPencilAlt aria-hidden="true" />
                          Editar
                        </button>
                        <button type="button" className="admin-btn danger" onClick={() => handleDeleteUser(item.id)}>
                          <FaTrash aria-hidden="true" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {showUserForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <header>
              <h3>{editingUser ? "Editar usuario" : "Nuevo usuario"}</h3>
              <button type="button" className="admin-btn" onClick={closeUserModal}>
                Cerrar
              </button>
            </header>
            <RegisterForm editingUser={editingUser} onSuccess={refreshUsers} onCancel={closeUserModal} />
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminUsers;
