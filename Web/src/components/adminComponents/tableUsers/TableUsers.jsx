import React, { useState, useRef, useEffect } from "react";
import "./tableUsers.css";

export default function UsersTable() {
  const [selection, setSelection] = useState([]);
  const checkboxRef = useRef();

  const items = [
    { id: 1, name: "Juan", email: "juaaa@gmail.com", date: "12/09/2000", password: "nata" },
    { id: 2, name: "Pepe", email: "juppn@gmail.com", date: "12/09/2000", password: "nata" },
    { id: 3, name: "Maria", email: "jmmn@gmail.com", date: "12/09/2000", password: "nata" },
    { id: 4, name: "Sonia", email: "soniaan@gmail.com", date: "12/09/2000", password: "nata" }
  ];

  const toggleRow = (id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selection.length === items.length) setSelection([]);
    else setSelection(items.map((i) => i.id));
  };

  // Actualizar indeterminate
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selection.length > 0 && selection.length < items.length;
    }
  }, [selection, items.length]);

  return (
    <div className="p-4">
      <table className="tabla">
        <thead>
          <tr className="encabezadoTabla">
            <th className="text-center">
              <input
                type="checkbox"
                ref={checkboxRef}
                checked={selection.length === items.length}
                onChange={toggleAll}
              />
            </th>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Password</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={selection.includes(item.id) ? "bg-blue-50" : "hover:bg-gray-50"}
            >
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={selection.includes(item.id)}
                  onChange={() => toggleRow(item.id)}
                />
              </td>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.date}</td>
              <td>{item.password}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => console.log("Editar", item)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selection.length > 0 && (
        <div className="selection-bar">
          <span>{selection.length} seleccionados</span>
          <button onClick={() => console.log("Eliminar", selection)}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
