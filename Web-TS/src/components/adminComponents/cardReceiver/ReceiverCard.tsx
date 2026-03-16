import type { ReceiverCardProps } from "@models/props/receiver";
import "./ReceiverCard.css";

export default function ReceiverCard({ receiver, onEdit, onDelete }: ReceiverCardProps) {
  const hasPosition = Number.isFinite(receiver?.x) && Number.isFinite(receiver?.y);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);

  const numericPower = Number(receiver?.powerConsumption);
  const formattedPower = Number.isFinite(numericPower)
    ? `${formatNumber(numericPower)} W`
    : "N/D";
  const formatCoord = (value: number | string | null | undefined) => Number(value).toFixed(2);

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
