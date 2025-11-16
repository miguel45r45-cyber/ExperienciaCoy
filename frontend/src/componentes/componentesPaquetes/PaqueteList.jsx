import { useEffect, useState } from "react";

export default function PaquetesList() {
    const [paquetes, setPaquetes] = useState([]);

    useEffect(() => {
    fetch("http://localhost:5000/api/paquetes")
        .then((r) => r.json())
        .then(setPaquetes);
    }, []);

    return (
    <div className="grid">
        {paquetes.map((p) => (
        <div className="card" key={p.idPaquete}>
            {p.imagen_url && (
            <img src={`http://localhost:5000/uploads/${p.imagen_url}`} alt={p.destino} />
            )}
            <h3>{p.destino}</h3>
            <p>Fecha: {p.fechaSalida}</p>
            <p>Hora: {p.hora}</p>
            <p>Cupos: {p.cupos_totales}</p>
            <p>Precio: ${p.monto}</p>
        </div>
        ))}
    </div>
    );
}
