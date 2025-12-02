import ReservacionItem from "../componenteReservacion/infoReservaciones/ReservacionInfo";

function ReservacionesPaqueteInactivo({ paquete, user, setData, token }) {
  return (
    <div className="paqueteConjunto inactivo">
      <h3 className="tituloReserva">
        {paquete.paquete.destino} (Inactivo)
      </h3>
      <div className="contenedor-reservaciones">
        {paquete.reservaciones.length === 0 ? (
          <p>No hay reservaciones para este paquete</p>
        ) : (
          paquete.reservaciones.map((res) => (
            <ReservacionItem
              key={res.idReservacion}
              res={res}
              user={user}
              token={token}
              setData={setData}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ReservacionesPaqueteInactivo;
