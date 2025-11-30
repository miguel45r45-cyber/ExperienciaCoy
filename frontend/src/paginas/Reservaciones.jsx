import React from 'react';
import ReservacionesAdminUser from '../componentes/componenteReservacion/ReservacionesAdminUser';
import "../paginas/stylosPaginas/styleReservaciones.css"

function Reservaciones() {
  return (
    <div>
      <h1 className='Titulopagina'>Página de Reservaciones</h1>
      <ReservacionesAdminUser />
    </div>
  );
}

export default Reservaciones;
