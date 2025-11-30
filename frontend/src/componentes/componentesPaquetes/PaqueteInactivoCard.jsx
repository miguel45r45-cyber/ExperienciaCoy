import { getCamposVisibles } from "../componentesPaquetes/utils/paqueteUtils";

export default function PaqueteInactivoCard({ paquete }) {
  return (
    <div className="CartaPaquete inactivo contenedorPaqueInactvo" key={paquete.idPaquete}>
      <div className="cPaqueteInactivo">
            <h3 className="TituloPaquete" >{paquete.destino}</h3>
          {getCamposVisibles(paquete).map(([campo, valor]) => (
            <p className="NombreInfo" key={campo}>{campo}: {valor}</p>
          ))}
      </div>
    </div>
  );
}
