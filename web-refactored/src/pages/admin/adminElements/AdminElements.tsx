import { useEffect, useMemo, useState } from "react";
import { FaCubes, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { Navigate } from "react-router-dom";

import { createElement, deleteElement, getAllElements, updateElement } from "@api/elements";
import { useAuth } from "@auth/auth";
import type { Identifier } from "@models/common";
import type { EnergyElement } from "@models/element";
import "../AdminBase.css";

function AdminElements() {
  const { user } = useAuth();
  const [elements, setElements] = useState<EnergyElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const elementStats = useMemo(() => {
    const totalPower = elements.reduce((accumulator, item) => accumulator + Number(item.powerWatt ?? item.powerConsumption ?? 0), 0);
    return { total: elements.length, totalPower };
  }, [elements]);

  useEffect(() => {
    let mounted = true;
    async function loadElements() {
      setLoading(true);
      setError(null);
      try {
        const elementData = await getAllElements();
        if (mounted) setElements(elementData);
      } catch (loadError) {
        console.error("No se pudieron cargar los elementos", loadError);
        if (mounted) setError("No se pudieron cargar los elementos.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadElements();
    return () => {
      mounted = false;
    };
  }, []);

  if (user?.role !== "admin") {
    return <Navigate to="/projects" replace />;
  }

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
      const element = elements.find((item) => String(item.id) === String(id));
      await deleteElement(id, element);
      setElements((current) => current.filter((item) => String(item.id) !== String(id)));
    } catch (deleteError) {
      console.error("No se pudo eliminar el elemento", deleteError);
      window.alert("No se pudo eliminar el elemento.");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">administración</p>
        <h1>Elementos</h1>
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p>Cargando datos...</p>
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

export default AdminElements;
