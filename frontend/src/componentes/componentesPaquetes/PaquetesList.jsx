import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { fetchPaquetes, guardarEdicion } from "../componentesPaquetes/funcionesAdmin/PaquetesFunciones.jsx";
import PaqueteActivoCard from "../componentesPaquetes/PaqueteActivoCard";
import PaqueteInactivoCard from "../componentesPaquetes/PaqueteInactivoCard";
import "../componentesPaquetes/StylePaquetes.css";

export default function PaquetesList() {
  const [paquetes, setPaquetes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [campoEditando, setCampoEditando] = useState(null);

  // 👇 ahora el rol viene directo del contexto
  const { token, rol } = useContext(UserContext);

  // cargar paquetes al montar
  useEffect(() => {
    fetchPaquetes().then((data) => {
      setPaquetes(Array.isArray(data) ? data : []);
    });
  }, []);

  // ✅ usar estadoPaqueteActivo en vez de activo
  const paquetesActivos = paquetes.filter(
    (p) => p.estadoPaqueteActivo === 1 || p.estadoPaqueteActivo === true
  );
  const paquetesInactivos = paquetes.filter(
    (p) => p.estadoPaqueteActivo === 0 || p.estadoPaqueteActivo === false
  );

  // Si no hay paquetes activos y el usuario NO es admin
  if (paquetesActivos.length === 0 && rol !== "admin") {
    return <p className="TituloSinPaquetes">No hay paquetes publicados</p>;
  }

  return (
    <div className="Paquete-Publi">
      {rol === "admin" ? (
        paquetesActivos.length === 0 ? (
          <h2 className="TituloPaqueteEstado">No hay paquetes activos</h2>
        ) : (
          <>
            <h2 className="TituloPaqueteEstado">Paquetes Activos</h2>
            {paquetesActivos.map((p) => (
              <div key={p.idPaquete} className="paqueteEnvuelto">
                <PaqueteActivoCard
                  paquete={p}
                  rol={rol}
                  token={token}
                  editando={editando}
                  campoEditando={campoEditando}
                  setEditando={setEditando}
                  setCampoEditando={setCampoEditando}
                  guardarEdicion={(paq) =>
                    guardarEdicion(paq, campoEditando, token).then((data) => {
                      alert(data?.mensaje || "Edición guardada");
                      setEditando(null);
                      setCampoEditando(null);
                      setPaquetes((prev) =>
                        prev.map((x) =>
                          x.idPaquete === paq.idPaquete ? { ...x, ...paq } : x
                        )
                      );
                    })
                  }
                  setPaquetes={setPaquetes}
                />
              </div>
            ))}
          </>
        )
      ) : (
        paquetesActivos.map((p) => (
          <div key={p.idPaquete} className="paqueteEnvuelto">
            <PaqueteActivoCard
              paquete={p}
              rol={rol}
              token={token}
              editando={editando}
              campoEditando={campoEditando}
              setEditando={setEditando}
              setCampoEditando={setCampoEditando}
              setPaquetes={setPaquetes}
            />
          </div>
        ))
      )}

      {rol === "admin" && paquetesInactivos.length > 0 && (
        <>
          <h2 className="TituloPaqueteEstado">Paquetes Inactivos</h2>
          {paquetesInactivos.map((p) => (
            <div key={p.idPaquete} className="paqueteEnvuelto inactivo">
              {/* ✅ pasar token y setPaquetes para reactivar */}
              <PaqueteInactivoCard paquete={p} token={token} setPaquetes={setPaquetes} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
