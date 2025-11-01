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
                <li>*Viajes</li>
                <li>*Tour</li>
                <li>*Full Day</li>
                <li>*Hospedajes</li>
            </ul>

            <div className="contenedor-otras-app" >
                <a href="https://www.facebook.com/share/1Ad3EkXgWs/" target="_blank" rel="noopener noreferrer">
                    <img className="otras-app" src="/imganes-otras-app/facebook.png" alt="facebook" />
                </a>
                <a href="https://www.instagram.com/experienciacoy?igsh=NWNxeThzdXRiNGx1" target="_blank" rel="noopener noreferrer">
                    <img className="otras-app" src="/imganes-otras-app/instagram.png" alt="instagram" />
                </a>
                <a href="https://www.tiktok.com/@experienciacoy?_t=ZM-8xyF24jKYrg&_r=1" target="_blank" rel="noopener noreferrer">
                    <img className="otras-app" src="/imganes-otras-app/tiktok.png" alt="tiktok" />
                </a>
            </div>

        </section>
    );
}

export default Inicio