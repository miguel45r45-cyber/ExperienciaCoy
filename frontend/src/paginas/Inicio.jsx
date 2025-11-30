import React from 'react'
import './stylosPaginas/styleInicio.css'

function Inicio(){
    return (
        <section className="contenido-pagina-preincipal">
            
            <h1 className="bienvenida" > 
                <span className="bienvenidaP1" >Bienvenido</span><br />
                <span className="bienvenidaP2" >ViajeroCoy</span>
            </h1>

            <ul className="servicios">
                <li>.Viajes</li>
                <li>.Tour</li>
                <li>.Full Day</li>
                <li>.Hospedajes</li>
            </ul>



        </section>
    );
}

export default Inicio