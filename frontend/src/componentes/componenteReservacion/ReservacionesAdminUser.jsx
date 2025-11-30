// ReservacionesAdminUser.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";

function ReservacionesAdminUser() {
  const [data, setData] = useState([]);
  const { token, user } = useContext(UserContext);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/reservaciones-agrupadas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const paquetes = res.data;

        // 🔎 cargar comentarios de cada reservación
        for (const paquete of paquetes) {
          for (const reservacion of paquete.reservaciones) {
            const comentarios = await axios.get(
              `http://localhost:5000/api/seguimiento/${reservacion.idReservacion}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            reservacion.seguimiento = comentarios.data;
          }
        }

        setData(paquetes);
      })
      .catch((err) => console.error("Error cargando reservaciones:", err));
  }, [token]);

  const guardarComentario = async (idReservacion, comentario) => {
    try {
      await axios.post(
        "http://localhost:5000/api/seguimiento",
        { idReservacion, comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // recargar comentarios
      const comentarios = await axios.get(
        `http://localhost:5000/api/seguimiento/${idReservacion}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) =>
        prev.map((p) => ({
          ...p,
          reservaciones: p.reservaciones.map((r) =>
            r.idReservacion === idReservacion
              ? { ...r, seguimiento: comentarios.data }
              : r
          ),
        }))
      );
    } catch (err) {
      console.error("Error guardando comentario:", err);
    }
  };

  const cambiarEstado = async (idReservacion, nuevoEstado) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reservaciones-estado/${idReservacion}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // actualizar estado en frontend
      setData((prev) =>
        prev.map((p) => ({
          ...p,
          reservaciones: p.reservaciones.map((r) =>
            r.idReservacion === idReservacion
              ? { ...r, estado: nuevoEstado }
              : r
          ),
        }))
      );
    } catch (err) {
      console.error("Error cambiando estado:", err);
    }
  };

  return (
    <div className="contenedor-paquetes">
      {data.length === 0 ? (
        <p className="tituloReserva paqueteConjunto">
          No hay reservaciones 
        </p>
      ) : (
        data.map((paquete) => (
          <div key={paquete.paquete.idPaquete} className="paqueteConjunto">
            {/* Encabezado del paquete */}
            <h2 className="tituloReserva">
              {paquete.paquete.destino} (
              {new Date(paquete.paquete.fechaSalida).toLocaleDateString("es-VE")}
              )
            </h2>

            {/* 🔎 Botón PDF dentro del paquete */}
            {user?.rol === "admin" && (
              <button
                className="btn-descargar btnDescarga"
                onClick={() => {
                  window.open(
                    "http://localhost:5000/api/reservaciones-pdf/aprobadas",
                    "_blank"
                  );
                }}
              >
                Descargar PDF de aprobadas
              </button>
            )}

            {/* 🔎 Cada reservación es un bloque independiente */}
            <div className="contenedor-reservaciones">
              {paquete.reservaciones.map((res) => (
                <div key={res.idReservacion} className="reservacionBloque">
                  {user?.rol === "admin" && (
                    <p className="nombreInfo">
                      <strong>cliente ID:</strong> {res.cliente_id}
                    </p>
                  )}
                  <p className="nombreInfo">
                    <strong>Nombre:</strong> {res.nombre_cliente}
                  </p>
                  <p className="nombreInfo">
                    <strong>CI:</strong> {res.ci_cliente}
                  </p>
                  <p className="nombreInfo">
                    <strong>Teléfono:</strong> {res.telefono_cliente}
                  </p>
                  <p className="nombreInfo">
                    <strong>Correo:</strong> {res.correo_cliente}
                  </p>
                  <p className="nombreInfo">
                    <strong>Cupos:</strong> {res.cupos}
                  </p>
                  <p className="nombreInfo">
                    <strong>Monto:</strong> {res.montoPagar}
                  </p>
                  <p className="nombreInfo">
                    <strong>Forma de pago:</strong> {res.formaPago}
                  </p>
                  <p className="nombreInfo">
                    <strong>Fecha reserva:</strong>{" "}
                    {new Date(res.fechaReserva).toLocaleString("es-VE")}
                  </p>

                  {/* Estado actual */}
                  <p className="nombreInfo">
                    <strong>Estado:</strong> {res.estado || "pendiente"}
                  </p>

                  {/* Botones Aprobar/Rechazar solo para admin */}
                  {user?.rol === "admin" && (
                    <div className="acciones">
                      <button 
                        className="btn btn-aprobar"
                        onClick={() =>
                          cambiarEstado(res.idReservacion, "aprobada")
                        }
                        disabled={res.estado === "aprobada"}
                      >
                        Aprobar
                      </button>
                      <button
                        className="btn btn-rechazar"
                        onClick={() =>
                          cambiarEstado(res.idReservacion, "rechazada")
                        }
                        disabled={res.estado === "aprobada"}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}

                  {/* Seguimiento: input + comentarios (solo si NO está aprobada) */}
                  {user?.rol === "admin" && res.estado !== "aprobada" && (
                    <div className="seguimiento">
                      <input className="campoComentario"
                        type="text"
                        placeholder="Escribe un comentario..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            guardarComentario(res.idReservacion, e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button className="btn"
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

                  {/* Mostrar comentarios guardados */}
                  <div className="comentarios">
                    {res.seguimiento?.map((c) => (
                      <p className="nombreInfo" key={c.idSeguimiento}>
                        <strong>
                          {new Date(c.fecha).toLocaleString("es-VE")}:
                        </strong>{" "}
                        {c.comentario}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReservacionesAdminUser;
