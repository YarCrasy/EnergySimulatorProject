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

  if (loading)
    return <p className="text-center py-10">Cargando receivers...</p>;

  return (
    <div className="receiver-list-page">
      <NavBar />

      <div className="receiver-list-container">
        <div className="receiver-list-header">
          <h1>Gestión de Elementos de Consumo</h1>
          <button
            onClick={() => {
              setEditingReceiver(null);
              setShowForm(true);
            }}
            className="btn-new-receiver"
          >
            Nuevo elemento de consumo
          </button>
        </div>

        {loading && <p className="loading-receivers">Cargando receivers...</p>}

        {!loading && receivers.length === 0 ? (
          <p className="no-receivers">
            No hay receivers aún. ¡Crea el primero!
          </p>
        ) : (
          <div className="receiver-cards">
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
