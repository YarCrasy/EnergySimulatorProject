import { useState } from "react";

export default function FormPanel() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [potencia, setPotencia] = useState("");
  const [eficiencia, setEficiencia] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear objeto de la placa con ID automático
    const nuevaPlaca = {
      id_placa: Date.now(), // ID único temporal
      marca: marca,
      modelo: modelo,
      potencia_wp: parseInt(potencia),
      eficiencia: eficiencia,
    };

    console.log("Placa creada:", nuevaPlaca);
    // Aquí podrías guardarlo en tu estado o enviar a la base de datos
  };

  return (
    <div className="formPanel">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Marca</label>
          <input
            type="text"
            placeholder="Ej: SunPower"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Modelo</label>
          <input
            type="text"
            placeholder="Ej: SPR-X21-345"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Potencia (Wp)</label>
          <input
            type="number"
            placeholder="Ej: 345"
            value={potencia}
            onChange={(e) => setPotencia(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Eficiencia</label>
          <input
            type="text"
            placeholder="Ej: 20%"
            value={eficiencia}
            onChange={(e) => setEficiencia(e.target.value)}
            required
          />
        </div>

        <button type="submit">Añadir Placa</button>
      </form>
    </div>
  );
}
