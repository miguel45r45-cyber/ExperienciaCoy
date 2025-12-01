import { getCamposVisibles } from "../componentesPaquetes/camposPaquetes/camposLlenosPaquetes";
import { reactivarPaquete } from "../componentesPaquetes/funcionesAdmin/PaquetesFunciones.jsx"; 

export default function PaqueteInactivoCard({ paquete, token, setPaquetes }) {
  const handleReactivar = async () => {
    const res = await reactivarPaquete(paquete.idPaquete, token);
    if (res.mensaje) {
      alert(res.mensaje);
      setPaquetes((prev) =>
        prev.map((p) =>
          p.idPaquete === paquete.idPaquete
            ? { ...p, estadoPaqueteActivo: 1 } 
            : p
        )
      );
    }
  };

  return (
    <div className="CartaPaquete inactivo contenedorPaqueteInactivo">
      <div className="cPaqueteInactivo">
        <h3 className="TituloPaquete">{paquete.destino}</h3>
        {getCamposVisibles(paquete).map(([campo, valor]) => (
          <p className="NombreInfo" key={campo}>
            {campo}: {valor}
          </p>
        ))}
        {/* botón de reactivar visible solo para admin */}
        <button className="BotonesPaquetes" onClick={handleReactivar}>
          Reactivar
        </button>
      </div>
    </div>
  );
}
