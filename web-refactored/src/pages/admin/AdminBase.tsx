import { useEffect, useMemo, useState } from "react";
import { FaCubes, FaPencilAlt, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import { Navigate } from "react-router-dom";

import { createElement, deleteElement, getAllElements, updateElement } from "../../api/elements";
import { deleteUser, getAllUsers, type UserProfile } from "../../api/users";
import { useAuth } from "../../auth/auth";
import RegisterForm from "../../components/registerForm/RegisterForm";
import type { EditableUser } from "../../components/registerForm/types";
import type { Identifier } from "../../models/common";
import type { EnergyElement } from "../../models/element";
import "./AdminBase.css";

interface AdminBaseProps {
  view: "users" | "elements";
}

function AdminBase({ view }: AdminBaseProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [elements, setElements] = useState<EnergyElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);

  const [showElementForm, setShowElementForm] = useState(false);
  const [savingElement, setSavingElement] = useState(false);
  const [editingElement, setEditingElement] = useState<EnergyElement | null>(null);
  const [elementForm, setElementForm] = useState({
    name: "",
    elementType: "consumer",
    category: "",
    description: "",
    powerWatt: "",
  });

  const userStats = useMemo(() => {
    const adminCount = users.filter((item) => item.admin || item.role === "admin").length;
    return { total: users.length, admins: adminCount, operators: users.length - adminCount };
  }, [users]);

  const elementStats = useMemo(() => {
    const totalPower = elements.reduce((accumulator, item) => accumulator + Number(item.powerWatt ?? item.powerConsumption ?? 0), 0);
    return { total: elements.length, totalPower };
  }, [elements]);

  const isAdminUser = user?.role === "admin";

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [userData, elementData] = await Promise.all([getAllUsers(), getAllElements()]);
        if (mounted) {
          setUsers(userData);
          setElements(elementData);
        }
      } catch (loadError) {
        console.error("No se pudieron cargar los datos de administracion", loadError);
        if (mounted) {
          setError("No se pudieron cargar los datos de administracion.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAdminUser) {
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

  const resetElementForm = () => {
    setElementForm({ name: "", elementType: "consumer", category: "", description: "", powerWatt: "" });
    setEditingElement(null);
  };

  const closeElementModal = () => {
    setShowElementForm(false);
    resetElementForm();
  };

  const openCreateElement = () => {
    resetElementForm();
    setShowElementForm(true);
  };

  const openEditElement = (element: EnergyElement) => {
    setEditingElement(element);
    setElementForm({
      name: String(element.name ?? ""),
      elementType: String(element.elementType ?? "consumer"),
      category: String(element.category ?? ""),
      description: String(element.description ?? ""),
      powerWatt: String(element.powerWatt ?? element.powerConsumption ?? ""),
    });
    setShowElementForm(true);
  };

  const handleSaveElement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!elementForm.name.trim()) {
      window.alert("El nombre es obligatorio.");
      return;
    }

    setSavingElement(true);
    try {
      const payload: Partial<EnergyElement> = {
        name: elementForm.name.trim(),
        elementType: elementForm.elementType.trim() || "consumer",
        category: elementForm.category.trim() || elementForm.elementType.trim() || "consumer",
        description: elementForm.description.trim(),
      };

      if (elementForm.powerWatt.trim() !== "") {
        payload.powerWatt = Number(elementForm.powerWatt);
        payload.powerConsumption = Number(elementForm.powerWatt);
      }

      if (editingElement?.id != null) {
        const updated = await updateElement(editingElement.id, payload);
        setElements((current) => current.map((item) => (String(item.id) === String(updated.id ?? editingElement.id) ? { ...item, ...updated } : item)));
      } else {
        const created = await createElement(payload);
        setElements((current) => [created, ...current]);
      }

      closeElementModal();
    } catch (saveError) {
      console.error("No se pudo guardar el elemento", saveError);
      window.alert("No se pudo guardar el elemento.");
    } finally {
      setSavingElement(false);
    }
  };

  const handleDeleteElement = async (id: Identifier | null | undefined) => {
    if (id == null) return;
    if (!window.confirm("Eliminar este elemento?")) return;

    try {
      await deleteElement(id);
      setElements((current) => current.filter((item) => String(item.id) !== String(id)));
    } catch (deleteError) {
      console.error("No se pudo eliminar el elemento", deleteError);
      window.alert("No se pudo eliminar el elemento.");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Administracion</p>
        <h1>{view === "users" ? "Usuarios" : "Elementos"}</h1>
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p>Cargando datos...</p>
        ) : view === "users" ? (
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
        ) : (
          <>
            <section className="admin-stats">
              <article>
                <span>{elementStats.total}</span>
                <p>Elementos</p>
              </article>
              <article>
                <span>{Math.round(elementStats.totalPower)}</span>
                <p>Potencia total W</p>
              </article>
            </section>

            <div className="admin-toolbar">
              <h2>Gestión de elementos</h2>
              <button type="button" className="admin-btn primary" onClick={openCreateElement}>
                <FaPlus aria-hidden="true" />
                Nuevo elemento
              </button>
            </div>

            <div className="admin-elements-grid">
              {elements.map((element) => (
                <article key={String(element.id ?? element.name)}>
                  <FaCubes aria-hidden="true" />
                  <h2>{element.name ?? "Elemento"}</h2>
                  <p>{element.category ?? element.elementType ?? "Catalogo"}</p>
                  <span>
                    {element.powerWatt ?? element.powerConsumption ?? element.capacity ?? "-"}{" "}
                    {element.powerWatt || element.powerConsumption ? "W" : ""}
                  </span>
                  <div className="admin-card-actions">
                    <button type="button" className="admin-btn" onClick={() => openEditElement(element)}>
                      <FaPencilAlt aria-hidden="true" />
                      Editar
                    </button>
                    <button type="button" className="admin-btn danger" onClick={() => handleDeleteElement(element.id)}>
                      <FaTrash aria-hidden="true" />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
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

      {showElementForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <header>
              <h3>{editingElement ? "Editar elemento" : "Nuevo elemento"}</h3>
              <button type="button" className="admin-btn" onClick={closeElementModal}>
                Cerrar
              </button>
            </header>
            <form className="admin-element-form" onSubmit={handleSaveElement}>
              <label>
                Nombre
                <input
                  value={elementForm.name}
                  onChange={(event) => setElementForm((current) => ({ ...current, name: event.target.value }))}
                  type="text"
                  required
                />
              </label>

              <label>
                Tipo
                <select
                  value={elementForm.elementType}
                  onChange={(event) => setElementForm((current) => ({ ...current, elementType: event.target.value }))}
                >
                  <option value="generator">Generador</option>
                  <option value="consumer">Consumidor</option>
                  <option value="storage">Almacenamiento</option>
                </select>
              </label>

              <label>
                Categoria
                <input
                  value={elementForm.category}
                  onChange={(event) => setElementForm((current) => ({ ...current, category: event.target.value }))}
                  type="text"
                />
              </label>

              <label>
                Potencia (W)
                <input
                  value={elementForm.powerWatt}
                  onChange={(event) => setElementForm((current) => ({ ...current, powerWatt: event.target.value }))}
                  type="number"
                  min="0"
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={elementForm.description}
                  onChange={(event) => setElementForm((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                />
              </label>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn primary" disabled={savingElement}>
                  {savingElement ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="admin-btn" onClick={closeElementModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminBase;
