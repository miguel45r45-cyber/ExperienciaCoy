import { useState, useContext } from "react";
import "../compoacceder/styleRegistro.css";
import { UserContext } from "../../UserContext";

export default function CrearPreguntaSeguridad() {
  const { user, token } = useContext(UserContext);
  const [form, setForm] = useState({ pregunta: "", respuesta: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pregunta.trim() || !form.respuesta.trim()) {
      alert("Debes llenar la pregunta y la respuesta");
      return;
    }

    if (!user?.cliente_id) {
      alert("No se encontró el ID del cliente. Inicia sesión nuevamente.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/seguridad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? "Bearer " + token : undefined,
        },
        body: JSON.stringify({
          cliente_id: user.cliente_id, // 👈 ahora sí enviamos el campo correcto
          pregunta: form.pregunta.trim(),
          respuesta: form.respuesta.trim(),
        }),
      });

      const data = await res.json();
      alert(data.message);
      window.location.reload();

      if (res.ok) {
        setForm({ pregunta: "", respuesta: "" });
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
