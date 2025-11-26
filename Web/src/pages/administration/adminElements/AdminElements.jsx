import "./AdminElements.css";
import NavBar from "../../../components/adminComponents/navBar/NavBar";

import { useState, useEffect } from "react";
import ReceiverCard from "../../../components/adminComponents/cardReceiver/cardReceiver";
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
      alert("Error al cargar receivers");
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
    } catch (err) {
      alert("Error al guardar");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este receiver?")) {
      try {
        await receiverApi.delete(id);
        loadReceivers();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  if (loading) return <p className="text-center py-10">Cargando receivers...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <NavBar />  
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Gestión de Receivers</h1>
          <button
            onClick={() => {
              setEditingReceiver(null);
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
          >
            + Nuevo Receiver
          </button>
        </div>

        {receivers.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">No hay receivers aún. ¡Crea el primero!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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