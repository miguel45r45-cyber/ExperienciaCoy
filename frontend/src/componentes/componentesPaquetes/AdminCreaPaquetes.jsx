import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import "../componentesPaquetes/StylePaquetes.css";

export default function AdminCrearPaquete() {
  const { token } = useContext(UserContext); // el token del admin ya está guardado en el contexto

  const [form, setForm] = useState({
    destino: "",
    fechaSalida: "",
    hora: "",
    transporte: "",
    traslado: "",
    servicios: "",
    alimentacion: "",
    bebidas: "",
    actividades: "",
    monto: ""
  });

  const [imagen, setImagen] = useState(null);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imagen) fd.append("imagen", imagen);

    try {
      const res = await fetch("http://localhost:5000/api/paquetes", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token // el backend obtiene rif_admin desde este token
        },
        body: fd,
      });

      const data = await res.json();
      alert(data.mensaje || "Paquete publicado con éxito");
      window.location.reload();
    } catch (error) {
      alert("Error al crear paquete");
    }
  };

  return (
    <div className="bloqueDeCreacion">
      <form onSubmit={onSubmit}>
        <h2 className="TituloTalba">Crear Paquete</h2>

        <label className="TituloCampo">Destino
          <input className="camposCreacion" name="destino" placeholder="Destino" onChange={onChange} />
        </label>

        <label className="TituloCampo">Fecha de salida
          <input className="camposCreacion" type="date" name="fechaSalida" onChange={onChange} />
        </label>

        <label className="TituloCampo">Hora de salida
          <input className="camposCreacion" name="hora" placeholder="Hora" onChange={onChange} />
        </label>

        <label className="TituloCampo">Transporte
          <input className="camposCreacion" name="transporte" placeholder="Transporte" onChange={onChange} />
        </label>

        <label className="TituloCampo">Traslado
          <input className="camposCreacion" name="traslado" placeholder="Traslado" onChange={onChange} />
        </label>

        <label className="TituloCampo">Servicios
          <input className="camposCreacion" name="servicios" placeholder="Servicios" onChange={onChange} />
        </label>

        <label className="TituloCampo">Alimentación
          <input className="camposCreacion" name="alimentacion" placeholder="Alimentación" onChange={onChange} />
        </label>

        <label className="TituloCampo">Bebidas
          <input className="camposCreacion" name="bebidas" placeholder="Bebidas" onChange={onChange} />
        </label>

        <label className="TituloCampo">Actividades
          <input className="camposCreacion" name="actividades" placeholder="Actividades" onChange={onChange} />
        </label>

        <label className="TituloCampo">Monto
          <input className="camposCreacion" type="float" step="0.01" name="monto" placeholder="Monto" onChange={onChange}
          />
        </label>

        <label className="TituloCampo">Imagen de paquete
          <input className="camposCreacion" type="file" onChange={(e) => setImagen(e.target.files[0])} />
        </label>

        <button className="botonPublicar">Publicar paquete</button>
      </form>
    </div>
  );
}
