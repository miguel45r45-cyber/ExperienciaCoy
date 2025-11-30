import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { fetchPaquetes, guardarEdicion } from "../componentesPaquetes/services/paquetesService";
import PaqueteActivoCard from "../componentesPaquetes/PaqueteActivoCard";
import PaqueteInactivoCard from "../componentesPaquetes/PaqueteInactivoCard";
import { decodeRol } from "../componentesPaquetes/utils/decodeRol";
import "../componentesPaquetes/StylePaquetes.css";

export default function PaquetesList() {
  const [paquetes, setPaquetes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [campoEditando, setCampoEditando] = useState(null);
  const { token } = useContext(UserContext);

  const rol = decodeRol(token);

  useEffect(() => {
    fetchPaquetes().then((data) => {
      setPaquetes(Array.isArray(data) ? data : []);
    });
  }, []);

  const paquetesActivos = paquetes.filter((p) => p.activo === 1 || p.activo === true);
  const paquetesInactivos = paquetes.filter((p) => p.activo === 0 || p.activo === false);

  if (paquetesActivos.length === 0 && rol !== "admin") {
    return <p className="TituloSinPaquetes">No hay paquetes publicados</p>;
  }

  return (
    <div className="Paquete-Publi">
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

      {rol === "admin" && paquetesInactivos.length > 0 && (
        <>
          <h2 className="TituloPaqueteEstado">Paquetes Inactivos</h2>
          {paquetesInactivos.map((p) => (
            <div key={p.idPaquete} className="paqueteEnvuelto inactivo">
              <PaqueteInactivoCard paquete={p} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
