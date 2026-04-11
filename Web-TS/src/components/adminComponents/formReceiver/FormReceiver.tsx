import { useState, useEffect, type ChangeEvent, type FormEvent, type InvalidEvent } from "react";
import type { FormReceiverProps } from "@models/props/receiver";
import "./FormReceiver.scss";

export default function FormReceiver({ receiverToEdit, onSave, onCancel }: FormReceiverProps) {
  const [nombre, setNombre] = useState("");
  const [consumo, setConsumo] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  useEffect(() => {
    if (receiverToEdit) {
      setNombre(receiverToEdit.name || "");
      setConsumo(receiverToEdit.powerConsumption ? String(receiverToEdit.powerConsumption) : "");
      setX(receiverToEdit.x ? String(receiverToEdit.x) : "");
      setY(receiverToEdit.y ? String(receiverToEdit.y) : "");
    } else {
      setNombre("");
      setConsumo("");
      setX("");
      setY("");
    }
  }, [receiverToEdit]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: nombre,
      powerConsumption: parseFloat(consumo) || 0,
      x: parseFloat(x) || 0,
      y: parseFloat(y) || 0,
    };
    onSave(receiverToEdit ? { ...data, id: receiverToEdit.id } : data);
  };

  const setValidityMessage = (
    event: InvalidEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
    message: string
  ) => {
    event.currentTarget.setCustomValidity(message);
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              onInvalid={(e) =>
                setValidityMessage(
                  e,
                  "Por favor, ingrese el nombre del elemento"
                )
              }
              onInput={(e) => setValidityMessage(e, "")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="receiver-consumo">Consumo (W)</label>
            <input
              id="receiver-consumo"
              type="number"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
              required
              onInvalid={(e) =>
                setValidityMessage(
                  e,
                  "Por favor, ingrese el consumo en watios del elemento"
                )
              }
              onInput={(e) => setValidityMessage(e, "")}
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
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  title="Inserte coordenada x"
                />
              </div>
              <div className="form-group">
                <label htmlFor="receiver-posy">Posición Y</label>
                <input
                  id="receiver-posy"
                  type="number"
                  step="0.01"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
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
