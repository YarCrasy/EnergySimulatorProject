import "./ReceiverCard.css";
import {
  hasReceiverCoordinates,
  hasReceiverPower,
  resolveReceiverPower,
} from "@/Models/receiver.model";

export default function ReceiverCard({ receiver, onEdit, onDelete }) {
  const hasPosition = hasReceiverCoordinates(receiver);
  const formatNumber = (value) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);

  const formattedPower = hasReceiverPower(receiver)
    ? `${formatNumber(resolveReceiverPower(receiver))} W`
    : "N/D";
  const formatCoord = (value) => Number(value).toFixed(2);

  return (
    <article className="receiver-card">
      <div className="receiver-card-header">
        <span className="receiver-chip">Elemento</span>
        <h3 className="receiver-name">{receiver.name}</h3>
      </div>

      <div className="receiver-meta">
        <p className="receiver-power">
          Consumo
          <span className="receiver-power-value">{formattedPower}</span>
        </p>
        {hasPosition ? (
          <p className="receiver-position">
            Posición <span>({formatCoord(receiver.x)}, {formatCoord(receiver.y)})</span>
          </p>
        ) : (
          <p className="receiver-position muted">Sin coordenadas registradas</p>
        )}
      </div>

      <div className="receiver-card-actions">
        <button
          onClick={() => onEdit(receiver)}
          className="receiver-card-btn receiver-card-btn-primary"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(receiver.id)}
          className="receiver-card-btn receiver-card-btn-danger"
        >
          Borrar
        </button>
      </div>
    </article>
  );
}
