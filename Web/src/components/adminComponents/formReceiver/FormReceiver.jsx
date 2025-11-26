// src/components/FormReceiver.jsx
import { useState, useEffect } from "react";

export default function FormReceiver({ receiverToEdit, onSave, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [consumo, setConsumo] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  useEffect(() => {
    if (receiverToEdit) {
      setNombre(receiverToEdit.name || "");
      setConsumo(receiverToEdit.powerConsumption || "");
      setX(receiverToEdit.x || "");
      setY(receiverToEdit.y || "");
    } else {
      setNombre("");
      setConsumo("");
      setX("");
      setY("");
    }
  }, [receiverToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: nombre,
      powerConsumption: parseFloat(consumo) || 0,
      x: parseFloat(x) || 0,
      y: parseFloat(y) || 0,
    };

    onSave(receiverToEdit ? { ...data, id: receiverToEdit.id } : data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">
          {receiverToEdit ? "Editar Receiver" : "Nuevo Receiver"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Consumo (W)</label>
            <input
              type="number"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Posición X</label>
              <input
                type="number"
                step="0.01"
                value={x}
                onChange={(e) => setX(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Posición Y</label>
              <input
                type="number"
                step="0.01"
                value={y}
                onChange={(e) => setY(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}