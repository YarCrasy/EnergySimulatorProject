import "./AdminElements.css";
import NavBar from "../../../components/adminComponents/navBar/NavBar";

import { useState, useEffect } from "react";
import ReceiverCard from "../../../components/adminComponents/cardReceiver/ReceiverCard";
import FormReceiver from "../../../components/adminComponents/formReceiver/FormReceiver";
import { receiverApi } from "../../../api/receiverApi";

export default function ReceiverList() {
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReceiver, setEditingReceiver] = useState(null);

  const loadReceivers = async () => {
    try {
      const data = await receiverApi.getAll();
      setReceivers(data);
    } catch (err) {
      alert("Error al cargar receivers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceivers();
  }, []);

  const hasCoordinates = (receiver) =>
    Number.isFinite(receiver?.x) && Number.isFinite(receiver?.y);

  const totalReceivers = receivers.length;
  const totalConsumption = receivers.reduce(
    (acc, item) => acc + (Number(item?.powerConsumption) || 0),
    0
  );
  const locatedReceivers = receivers.filter(hasCoordinates).length;
  const averageConsumption = totalReceivers
    ? totalConsumption / totalReceivers
    : 0;

  const formatInteger = (value) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);

  const formatWatts = (value) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);

  const formatKw = (value) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(
      value / 1000
    );

  const handleSave = async (data) => {
    try {
      if (editingReceiver) {
        await receiverApi.update(editingReceiver.id, data);
      } else {
        await receiverApi.create(data);
      }
      loadReceivers();
      setShowForm(false);
      setEditingReceiver(null);
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este receiver?")) {
      try {
        await receiverApi.delete(id);
        loadReceivers();
      } catch (e) {
        alert("Error al eliminar: " + e.message);
      }
    }
  };

  return (
    <div className="receiver-list-page">
      <NavBar />

      <div className="receiver-shell">
        <section className="receiver-hero">
          <p className="receiver-eyebrow">Panel administrativo</p>
          <h1>Gestiona los elementos de consumo conectados a tu red</h1>
          <p>
            Supervisa el consumo declarado, localiza dispositivos y mantén tu
            inventario sincronizado con el estado real de tus receivers.
          </p>

          <div className="receiver-stats">
            <article>
              <span>{formatInteger(totalReceivers)}</span>
              <p>Elementos activos</p>
            </article>
            <article>
              <span>{formatKw(totalConsumption)} kW</span>
              <p>Consumo total estimado</p>
            </article>
            <article>
              <span>{formatInteger(locatedReceivers)}</span>
              <p>Con coordenadas</p>
            </article>
            <article>
              <span>{formatWatts(averageConsumption)} W</span>
              <p>Consumo promedio</p>
            </article>
          </div>
        </section>

        <section className="receiver-panel">
          <header>
            <div>
              <h2>Inventario de consumo</h2>
              <p>
                Añade, edita o elimina elementos según su consumo nominal y
                ubicación planeada.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingReceiver(null);
                setShowForm(true);
              }}
              className="btn-new-receiver"
            >
              Nuevo elemento de consumo
            </button>
          </header>

          {loading ? (
            <p className="receiver-loading">Cargando elementos...</p>
          ) : receivers.length === 0 ? (
            <div className="receiver-empty">
              <p>No hay receivers registrados todavía.</p>
              <span>Comienza creando el primero para visualizar sus datos.</span>
            </div>
          ) : (
            <div className="receiver-cards-grid">
              {receivers.map((receiver) => (
                <ReceiverCard
                  key={receiver.id}
                  receiver={receiver}
                  onEdit={(r) => {
                    setEditingReceiver(r);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <FormReceiver
          receiverToEdit={editingReceiver}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingReceiver(null);
          }}
        />
      )}
    </div>
  );
}
