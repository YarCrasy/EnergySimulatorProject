import "./ReceiverCard.css";

export default function ReceiverCard({ receiver, onEdit, onDelete }) {
  return (
    <div className="receiver-card">
      <h3 className="receiver-name">{receiver.name}</h3>
      <p className="receiver-power">
        Consumo: <span className="receiver-power-value">{receiver.powerConsumption} W</span>
      </p>
      {receiver.x !== null && receiver.y !== null && (
        <p className="receiver-position">
          Posición: ({receiver.x.toFixed(2)}, {receiver.y.toFixed(2)})
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
