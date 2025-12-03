import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import "../componenteReservacion/StyleReserva.css";

export default function GestionReservacion({ paquete, token, rol }) {
  const { user } = useContext(UserContext);
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [cupos, setCupos] = useState(1);
  const [montoTotal, setMontoTotal] = useState(paquete?.monto ?? 0);

  // 🔎 Cargar métodos de pago activos
  useEffect(() => {
    fetch("http://localhost:5000/api/metodo_pago")
      .then((r) => r.json())
      .then((data) => {
        const activos = data.filter((m) => m.activo === 1);
        setMetodosPago(activos);
      })
      .catch(() => setMetodosPago([]));
  }, []);

  // 🔎 Recalcular monto total cuando cambian cupos
  useEffect(() => {
    setMontoTotal((paquete?.monto ?? 0) * cupos);
  }, [cupos, paquete?.monto]);

  const hacerReserva = async () => {
    if (rol === "admin") {
      alert("Los administradores no pueden realizar reservaciones");
      return;
    }
    if (!token) {
      alert("Debes iniciar sesión para reservar");
      return;
    }
    if (!metodoSeleccionado) {
      alert("Debes seleccionar un método de pago");
      return;
    }

    // 🔎 Solo enviamos los datos necesarios
    const body = {
      cliente_id: user?.cliente_id,
      paquete_id: paquete.idPaquete,
      cupos,
      montoPagar: montoTotal,
      metodoPago_id: metodoSeleccionado,
    };

    try {
      const res = await fetch("http://localhost:5000/api/reservaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      alert(data.mensaje || "Reservación creada");
      window.location.reload();
    } catch {
      alert("Error al crear reservación");
    }
  };

  return (
    <div className="containerInfoEdid reservacion">
      <label className="infoMonto"><b>Cupos:</b></label>
      <input
        className="campoCupos"
        type="number"
        min="1"
        value={cupos}
        onChange={(e) => setCupos(Number(e.target.value))}
      />
      <p className="infoMonto">Monto total: ${montoTotal}</p>

      <p className="infoMonto">Métodos de pago:</p>
      {metodosPago.length > 0 ? (
        metodosPago.map((m) => (
          <button
            className="BotonReserva"
            key={m.idMetodoPago}
            onClick={() => setMetodoSeleccionado(m.idMetodoPago)}
            style={{
              backgroundColor:
                metodoSeleccionado === m.idMetodoPago
                  ? "rgba(5, 88, 88, 0.521)"
                  : "rgba(85, 245, 245, 0.521)",
              margin: "5px",
            }}
          >
            {m.formaPago}
          </button>
        ))
      ) : (
        <p className="nombreCampo">No hay métodos de pago disponibles</p>
      )}

      <br />
      <button className="BotonReserva" onClick={hacerReserva}>
        Confirmar Reservación
      </button>
    </div>
  );
}
