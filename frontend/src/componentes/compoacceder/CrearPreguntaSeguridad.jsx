import { useState } from "react";
import "../compoacceder/styleRegistro.css";

export default function CrearPreguntaSeguridad() {
  const [form, setForm] = useState({ pregunta: "", respuesta: "" });

  const clienteId = localStorage.getItem("cliente_id_registro");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pregunta.trim() || !form.respuesta.trim()) {
      alert("Debes llenar la pregunta y la respuesta");
      return;
    }

    if (!clienteId) {
      alert("No se encontró el ID del cliente. Regístrate primero.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/seguridad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clienteId,
          pregunta: form.pregunta.trim(),
          respuesta: form.respuesta.trim(),
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        setForm({ pregunta: "", respuesta: "" });
        alert("Pregunta de seguridad guardada. Ahora inicia sesión.");
        window.location.reload(); // 👈 ahora sí refresca la pantalla
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="tituloPregunta">Crear pregunta de seguridad</h2>
      <div className="containerFromPregunta">
        <label className="nombreCampo">
          Pregunta
          <input
            className="campo-informacion"
            name="pregunta"
            placeholder="Escribe tu pregunta"
            value={form.pregunta}
            onChange={handleChange}
          />
        </label>
        <label className="nombreCampo">
          Respuesta
          <input
            className="campo-informacion"
            name="respuesta"
            placeholder="Escribe tu respuesta"
            value={form.respuesta}
            onChange={handleChange}
          />
        </label>
        <button className="boton_guardar" type="submit">
          <b>Guardar</b>
        </button>
      </div>
    </form>
  );
}
