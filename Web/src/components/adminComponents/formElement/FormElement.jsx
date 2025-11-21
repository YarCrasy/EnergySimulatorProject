import { useState } from "react";

export default function FormElement() {
  const [nombre, setNombre] = useState("");
  const [consumo, setConsumo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generar un ID único automáticamente
    const nuevoElemento = {
      id_consumo: Date.now(), // ID único temporal
      nombre_instalacion: nombre,
      consumo_wt: parseInt(consumo),
    };

    console.log("Elemento creado:", nuevoElemento);
    // Aquí añadirías el elemento a tu estado o base de datos
  };

  return (
    <div className="formElement">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Nombre del elemento</label>
          <input
            type="text"
            placeholder="Ej:Casa unifamiliar"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Consumo en vatios</label>
          <input
            type="number"
            placeholder="Ej: 600"
            value={consumo}
            onChange={(e) => setConsumo(e.target.value)}
            required
          />
        </div>

        <button type="submit">Añadir Elemento</button>
      </form>
    </div>
  );
}
