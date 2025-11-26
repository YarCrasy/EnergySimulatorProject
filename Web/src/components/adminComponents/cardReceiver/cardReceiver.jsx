
export default function ReceiverCard({ receiver, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800">{receiver.name}</h3>
      <p className="text-gray-600 mt-2">
        Consumo: <span className="font-bold text-blue-600">{receiver.powerConsumption} W</span>
      </p>
      {receiver.x !== null && receiver.y !== null && (
        <p className="text-sm text-gray-500 mt-2">
          Posición: ({receiver.x.toFixed(2)}, {receiver.y.toFixed(2)})
        </p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onEdit(receiver)}
          className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(receiver.id)}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}