import { getCamposVisibles } from "../componentesPaquetes/camposPaquetes/camposLlenosPaquetes";
import { inactivarPaquete, eliminarPaquete, guardarEdicion } from "../componentesPaquetes/funcionesAdmin/PaquetesFunciones.jsx";
import GestionReservacion from "../componenteReservacion/GestionReservacion";
import "../componentesPaquetes/StylePaquetes.css";

export default function PaqueteActivoCard({
  paquete,
  rol,
  token,
  editando,
  campoEditando,
  setEditando,
  setCampoEditando,
  setPaquetes
}) {
  const camposDisponibles = [
    "destino", "fechaSalida", "hora", "transporte", "traslado", "servicios",
    "alimentacion", "bebidas", "actividades", "monto", "imagen_url" // ✅ corregido
  ];

  const handleEliminar = async () => {
    const res = await eliminarPaquete(paquete.idPaquete, token);
    if (res.mensaje?.includes("reservaciones")) {
      alert("No se puede eliminar: el paquete tiene reservaciones activas. Usa Inactivar.");
    } else {
      setPaquetes((prev) => prev.filter((p) => p.idPaquete !== paquete.idPaquete));
    }
  };

  const handleInactivar = async () => {
    const res = await inactivarPaquete(paquete.idPaquete, token);
    if (res.mensaje) {
      setPaquetes((prev) =>
        prev.map((p) =>
          p.idPaquete === paquete.idPaquete
            ? { ...p, estadoPaqueteActivo: 0 } // ✅ usar campo correcto
            : p
        )
      );
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const res = await guardarEdicion(paquete, campoEditando, token);
    if (res.mensaje) {
      alert(res.mensaje);
      setCampoEditando(null);
      setEditando(null);
    }
  };

  return (
    <div className="CartaPaquete" key={paquete.idPaquete}>
      {editando === paquete.idPaquete ? (
        campoEditando ? (
          <form className="formEditar" onSubmit={handleGuardar}>
            {campoEditando === "imagen_url" ? (   // ✅ corregido
              <input 
                className="inputEditar"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPaquetes((prev) =>
                    prev.map((p) =>
                      p.idPaquete === paquete.idPaquete
                        ? { ...p, imagen_url: e.target.files[0] } // ✅ usar imagen_url
                        : p
                    )
                  )
                }
              />
            ) : (
              <input 
                className="inputEditar"
                name={campoEditando}
                value={paquete[campoEditando] ?? ""}
                onChange={(e) =>
                  setPaquetes((prev) =>
                    prev.map((p) =>
                      p.idPaquete === paquete.idPaquete
                        ? { ...p, [campoEditando]: e.target.value }
                        : p
                    )
                  )
                }
              />
            )}
            <div className="accionesEditar">
              <button className="BotonesPaquetes" type="submit">Guardar</button>
              <button
                className="BotonesPaquetes"
                type="button"
                onClick={() => {
                  setCampoEditando(null);
                  setEditando(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="containerEditar">
            <p className="tituloSeccion">¿Qué campo deseas editar?</p>
            {camposDisponibles.map((campo) => (
              <button
                className="botonEdid"
                key={campo}
                onClick={() => setCampoEditando(campo)}
              >
                {campo}
              </button>
            ))}
            <button
              className="BotonesPaquetes"
              onClick={() => setEditando(null)}
            >
              Cancelar
            </button>
          </div>
        )
      ) : (
        <>
          {paquete.imagen_url && (
            <div className="imagenPaquete">
              <img
                className="imagen"
                src={`http://localhost:5000/uploads/${paquete.imagen_url}`}
                alt={paquete.destino}
              />
            </div>
          )}

          <div className="containerinfoPaquete">
            <h3 className="TituloPaquete">{paquete.destino}</h3>
            <p className="NombreInfo">
              Fecha:{" "}
              {new Date(paquete.fechaSalida).toLocaleDateString("es-VE")}
            </p>
            {getCamposVisibles(paquete).map(([campo, valor]) => (
              <p className="NombreInfo" key={campo}>
                {campo}: {valor}
              </p>
            ))}
            <GestionReservacion paquete={paquete} rol={rol} token={token} />
          </div>
        </>
      )}

      {rol?.toLowerCase() === "admin" && (
        <div className="acciones-admin componentesEstado">
          <div className="containerbotones">
            <button
              className="BotonesPaquetes"
              onClick={() => setEditando(paquete.idPaquete)}
            >
              Editar
            </button>
            <button className="BotonesPaquetes" onClick={handleInactivar}>
              Inactivar
            </button>
            <button className="BotonesPaquetes" onClick={handleEliminar}>
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
