import React from "react";

function ReservacionInfo({ res, user, cambiarEstado, guardarComentario }) {
  return (
    <div className="reservacionBloque">
      {user?.rol === "admin" && (
        <p className="nombreInfo">
          <strong>Cliente ID:</strong> {res.cliente_id}
        </p>
      )}

      {/* 🔎 Datos del cliente (JOIN con tabla cliente) */}
      <p className="nombreInfo"><strong>Nombre:</strong> {res.nombre_cliente}</p>
      <p className="nombreInfo"><strong>CI:</strong> {res.ci_cliente}</p>
      <p className="nombreInfo"><strong>Teléfono:</strong> {res.telefono_cliente}</p>
      <p className="nombreInfo"><strong>Correo:</strong> {res.correo_cliente}</p>

      {/* 🔎 Datos de la reservación */}
      <p className="nombreInfo"><strong>Cupos:</strong> {res.cupos}</p>
      <p className="nombreInfo"><strong>Monto:</strong> {res.montoPagar}</p>
      <p className="nombreInfo"><strong>Forma de pago:</strong> {res.formaPago}</p>
      <p className="nombreInfo">
        <strong>Fecha reserva:</strong>{" "}
        {new Date(res.fechaReserva).toLocaleString("es-VE")}
      </p>
      <p className="nombreInfo"><strong>Estado:</strong> {res.estado || "pendiente"}</p>

      {/* 🔎 Botones de aprobar/rechazar/pendiente solo para admin */}
      {user?.rol === "admin" && (
        <div className="acciones">
          <button
            className="btn btn-aprobar"
            onClick={() => cambiarEstado(res.idReservacion, "aprobada")}
            disabled={res.estado === "aprobada"}
          >
            Aprobar
          </button>
          <button
            className="btn btn-rechazar"
            onClick={() => cambiarEstado(res.idReservacion, "rechazada")}
            disabled={res.estado === "rechazada"}
          >
            Rechazar
          </button>
          <button
            className="btn btn-pendiente"
            onClick={() => cambiarEstado(res.idReservacion, "pendiente")}
            disabled={res.estado === "pendiente"}
          >
            Pendiente
          </button>
        </div>
      )}

      {/* 🔎 Comentarios de seguimiento SOLO si está en pendiente */}
      {user?.rol === "admin" && res.estado === "pendiente" && (
        <div className="seguimiento">
          <input
            className="campoComentario"
            type="text"
            placeholder="Escribe un comentario..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                guardarComentario(res.idReservacion, e.target.value);
                e.target.value = "";
              }
            }}
          />
          <button
            className="btn"
            onClick={(e) => {
              const input = e.target.previousSibling;
              guardarComentario(res.idReservacion, input.value);
              input.value = "";
            }}
          >
            Guardar comentario
          </button>
        </div>
      )}

      {/* 🔎 Lista de comentarios */}
      <div className="comentarios">
        {res.seguimiento?.map((c) => (
          <p className="nombreInfo" key={c.idSeguimiento}>
            <strong>{new Date(c.fecha).toLocaleString("es-VE")}:</strong>{" "}
            {c.comentario}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ReservacionInfo;
