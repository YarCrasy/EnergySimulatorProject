import "./TableUsers.css";

export default function TableUsers({ users, onEdit, onDelete, currentUser }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Nacimiento</th>
          {currentUser?.role === "admin" && <th>Acciones</th>}
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.fullName}</td>
            <td>{u.email}</td>
            <td>{u.dateOfBirth}</td>

            {currentUser?.role === "admin" && (
              <td>
                <button onClick={() => onEdit(u)}>Editar</button>
                <button onClick={() => onDelete(u.id)}>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
