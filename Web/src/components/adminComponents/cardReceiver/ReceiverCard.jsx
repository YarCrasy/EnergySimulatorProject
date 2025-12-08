import "./ReceiverCard.css";

export default function ReceiverCard({ receiver, onEdit, onDelete }) {
  const hasPosition = Number.isFinite(receiver?.x) && Number.isFinite(receiver?.y);
  const formattedPower = Number.isFinite(receiver?.powerConsumption)
    ? `${receiver.powerConsumption} W`
    : "N/D";
  const formatCoord = (value) => Number(value).toFixed(2);

  return (
    <div className="receiver-card">
      <h3 className="receiver-name">{receiver.name}</h3>
      <p className="receiver-power">
        Consumo: <span className="receiver-power-value">{formattedPower}</span>
      </p>
      {hasPosition && (
        <p className="receiver-position">
          Posición: ({formatCoord(receiver.x)}, {formatCoord(receiver.y)})
        </p>
      )}

      <div className="receiver-buttons">
        <button onClick={() => onEdit(receiver)} className="btn btn-edit">
          Editar
        </button>
        <button onClick={() => onDelete(receiver.id)} className="btn btn-delete">
          Borrar
        </button>
      </div>
    </div>
  );
}
