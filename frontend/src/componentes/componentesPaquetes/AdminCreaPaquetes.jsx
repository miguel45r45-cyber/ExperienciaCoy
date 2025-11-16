import { useState } from "react";

export default function AdminCrearPaquete() {
    const [form, setForm] = useState({
    destino: "", fechaSalida: "", hora: "",
    transporte: "", traslado: "", servicios: "",
    alimentacion: "", bebidas: "", actividades: "",
    monto: "", cupos_totales: ""
    });
    const [imagen, setImagen] = useState(null);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imagen) fd.append("imagen", imagen);

    const res = await fetch("http://localhost:5000/api/paquetes", {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        body: fd,
    });
    const data = await res.json();
    alert(data.mensaje || "Listo");
    };

    return (
    <form onSubmit={onSubmit}>
        <h2>Crear Paquete</h2>
        <input name="destino" placeholder="Destino" onChange={onChange} />
        <input type="date" name="fechaSalida" onChange={onChange} />
        <input name="hora" placeholder="Hora" onChange={onChange} />
        <input name="transporte" placeholder="Transporte" onChange={onChange} />
        <input name="traslado" placeholder="Traslado" onChange={onChange} />
        <input name="servicios" placeholder="Servicios" onChange={onChange} />
        <input name="alimentacion" placeholder="Alimentación" onChange={onChange} />
        <input name="bebidas" placeholder="Bebidas" onChange={onChange} />
        <input name="actividades" placeholder="Actividades" onChange={onChange} />
        <input type="number" name="monto" placeholder="Monto" onChange={onChange} />
        <input type="number" name="cupos_totales" placeholder="Cupos totales" onChange={onChange} />
        <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
        <button>Publicar paquete</button>
    </form>
    );
}
