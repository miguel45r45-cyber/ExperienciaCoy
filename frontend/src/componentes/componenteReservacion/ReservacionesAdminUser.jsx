import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { useComentarios } from "../componenteReservacion/funcionComentarios/useComentarios";
import ReservacionItem from "../componenteReservacion/infoReservaciones/ReservacionInfo";

function ReservacionesAdminUser() {
  const [data, setData] = useState([]);
  const { token, user } = useContext(UserContext);
  const { cargarComentarios, guardarComentario } = useComentarios(token);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/reservaciones-agrupadas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const paquetes = res.data;
        for (const paquete of paquetes) {
          for (const reservacion of paquete.reservaciones) {
            reservacion.seguimiento = await cargarComentarios(reservacion.idReservacion);
          }
        }
        setData(paquetes);
      })
      .catch((err) => console.error("Error cargando reservaciones:", err));
  }, [token]);

  const cambiarEstado = async (idReservacion, nuevoEstado) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reservaciones-estado/${idReservacion}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) =>
        prev.map((p) => ({
          ...p,
          reservaciones: p.reservaciones.map((r) =>
            r.idReservacion === idReservacion ? { ...r, estado: nuevoEstado } : r
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
        <p className="tituloReserva paqueteConjunto">No hay reservaciones</p>
      ) : (
        data.map((paquete) => (
          <div key={paquete.paquete.idPaquete} className="paqueteConjunto">
            <h2 className="tituloReserva">
              {paquete.paquete.destino} (
              {new Date(paquete.paquete.fechaSalida).toLocaleDateString("es-VE")}
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

            <div className="contenedor-reservaciones">
              {paquete.reservaciones.map((res) => (
                <ReservacionItem
                  key={res.idReservacion}
                  res={res}
                  user={user}
                  cambiarEstado={cambiarEstado}
                  guardarComentario={async (id, comentario) => {
                    const nuevos = await guardarComentario(id, comentario);
                    setData((prev) =>
                      prev.map((p) => ({
                        ...p,
                        reservaciones: p.reservaciones.map((r) =>
                          r.idReservacion === id ? { ...r, seguimiento: nuevos } : r
                        ),
                      }))
                    );
                  }}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReservacionesAdminUser;
