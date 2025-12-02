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

  // 🔎 Ordenar paquetes por fecha de salida (más próxima primero)
  const paquetesOrdenados = [...data].sort(
    (a, b) => new Date(a.paquete.fechaSalida) - new Date(b.paquete.fechaSalida)
  );

  // 🔎 Separar activos e inactivos
  const activos = paquetesOrdenados.filter(p => p.paquete.estadoPaqueteActivo === 1);
  const inactivos = paquetesOrdenados.filter(p => p.paquete.estadoPaqueteActivo === 0);

  // 🔎 Función auxiliar para renderizar un paquete
  const renderPaquete = (paquete) => {
    const pendientes = paquete.reservaciones
      .filter((r) => r.estado === "pendiente")
      .sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva));

    const procesadas = paquete.reservaciones
      .filter((r) => r.estado === "aprobada" || r.estado === "rechazada")
      .sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva));

    return (
      <div key={paquete.paquete.idPaquete} className="paqueteConjunto">
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
          {pendientes.length > 0 &&
            pendientes.map((res) => (
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

        {/* 🔎 Bloque de procesadas */}
        {procesadas.length > 0 && (
          <div className="contenedor-reservaciones procesadas">
            <h3 className="tituloProcesadas">Reservaciones procesadas</h3>
            {procesadas.map((res) => (
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
        )}
      </div>
    );
  };

  return (
    <div className="contenedor-paquetes">
      {/* Bloque Activos */}
      <div className="paquetes-activos">
        <h1>Paquetes Activos</h1>
        {activos.length === 0 ? (
          <p>No hay reservaciones en paquetes activos</p>
        ) : (
          activos.map(renderPaquete)
        )}
      </div>

      {/* Bloque Inactivos */}
      <div className="paquetes-inactivos">
        <h1>Paquetes Inactivos</h1>
        {inactivos.length === 0 ? (
          <p>No hay reservaciones en paquetes inactivos</p>
        ) : (
          inactivos.map(renderPaquete)
        )}
      </div>
    </div>
  );
}

export default ReservacionesAdminUser;
