import ReservacionItem from "../componenteReservacion/infoReservaciones/ReservacionInfo";

function ReservacionesPaqueteActivo({ paquete, user, setData, token }) {
  const pendientes = paquete.reservaciones
    .filter((r) => r.estado === "pendiente")
    .sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva));

  const procesadas = paquete.reservaciones
    .filter((r) => r.estado === "aprobada" || r.estado === "rechazada")
    .sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva));

  return (
    <div className="paqueteConjunto">
      <h2 className="tituloReserva">
        {paquete.paquete.destino} (
        {new Date(paquete.paquete.fechaSalida).toLocaleDateString("es-VE")}{" "}
        {new Date(paquete.paquete.fechaSalida).toLocaleTimeString("es-VE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
        )
      </h2>

      {user?.rol === "admin" && (
        <button
          className="btn-descargar btnDescarga"
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reservaciones-pdf/aprobadas",
              "_blank"
            )
          }
        >
          Descargar PDF de aprobadas
        </button>
      )}

      {/* 🔎 Bloque de pendientes */}
      <div className="contenedor-reservaciones">
        <h3 className="tituloPendientes">
          {pendientes.length === 0
            ? "No hay reservaciones pendientes"
            : "Reservaciones pendientes"}
        </h3>
        {pendientes.map((res) => (
          <ReservacionItem
            key={res.idReservacion}
            res={res}
            user={user}
            token={token}
            setData={setData}
          />
        ))}
      </div>

      {/* 🔎 Bloque de procesadas */}
      {procesadas.length > 0 && (
        <div className="contenedor-reservaciones procesadas">
          <h3 className="tituloProcesadas">Reservaciones procesadas</h3>
          {procesadas.map((res) => (
            <ReservacionItem
              key={res.idReservacion}
              res={res}
              user={user}
              token={token}
              setData={setData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservacionesPaqueteActivo;
