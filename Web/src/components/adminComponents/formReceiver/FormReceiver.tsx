import { useState, useEffect } from "react";
import {
  buildReceiverPayload,
  EMPTY_RECEIVER_FORM,
  toReceiverFormModel,
} from "@/Models/receiver.model";
import "./FormReceiver.css";

export default function FormReceiver({ receiverToEdit = null, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_RECEIVER_FORM }));

  useEffect(() => {
    setForm(toReceiverFormModel(receiverToEdit));
  }, [receiverToEdit]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(buildReceiverPayload(form, receiverToEdit));
  };

  return (
    <div className="receiver-modal-overlay">
      <div className="receiver-modal" role="dialog" aria-modal="true" aria-labelledby="receiver-modal-title" aria-describedby="receiver-modal-desc">
        <h2 id="receiver-modal-title" className="receiver-modal-title">
          {receiverToEdit ? "Editar Receiver" : "Nuevo Receiver"}
        </h2>
        <p id="receiver-modal-desc" className="receiver-modal-subtitle">
          {receiverToEdit
            ? "Ajusta el consumo y la posición de este elemento."
            : "Define el consumo nominal y su localización estimada."}
        </p>

        <form onSubmit={handleSubmit} className="receiver-form">
          <div className="form-group">
            <label htmlFor="receiver-nombre">Nombre</label>
            <input
              id="receiver-nombre"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  "Por favor, ingrese el nombre del elemento"
                )
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="receiver-consumo">Consumo (W)</label>
            <input
              id="receiver-consumo"
              type="number"
              value={form.powerConsumption}
              onChange={handleChange("powerConsumption")}
              required
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  "Por favor, ingrese el consumo en watios del elemento"
                )
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
            />
          </div>

          <div className="form-grid">
            <p>Posiciones (opcional)</p>
            <div className="position">
              <div className="form-group">
                <label htmlFor="receiver-posx">Posición X</label>
                <input
                  id="receiver-posx"
                  type="number"
                  step="0.01"
                  value={form.x}
                  onChange={handleChange("x")}
                  title="Inserte coordenada x"
                />
              </div>
              <div className="form-group">
                <label htmlFor="receiver-posy">Posición Y</label>
                <input
                  id="receiver-posy"
                  type="number"
                  step="0.01"
                  value={form.y}
                  onChange={handleChange("y")}
                   title= "Inserte coordenada y"
                />
              </div>
            </div>
          </div>

          <div className="receiver-form-buttons">
            <button
              type="submit"
              className="receiver-form-btn receiver-form-btn-primary"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="receiver-form-btn receiver-form-btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
