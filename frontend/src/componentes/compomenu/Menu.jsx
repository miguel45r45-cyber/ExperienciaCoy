import { useState, useEffect } from 'react';//useState guarda al usuario actal y use efect lo busca desde el almacenamiento local
import { Link, useNavigate } from 'react-router-dom';//usenavigation dirige al usuario al iniciar seccion link permite navegar entre pagina
import "../compomenu/StyleMenu.css";

function Menu() {
  //comprueva el nombre del usuario si esta logiado lo guarda  y muestra junto a boton para cerrar seccion
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {//revisa si el usuario ests guardado si lo encuentra lo lo carga
    const guardado = localStorage.getItem('usuario');
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');// corra al usuario guardado
    setUsuario(null);//limpia el estado
    alert('Sesión cerrada');//muestra mensaje
    navigate('/');//redirige als inicio
  };
//links para navegar entre paginas, logo y nombre
  return (
    <>
      {usuario && (
        <div className="bienvenida-usuario">
              <span className='mensajeBienbenida'>Bienvenido, {usuario.nombre}</span>
              <button className='botonCerrarSesion' onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}

      <div className='contenedor-menu-principal separacion-menu'>
        <div>
          <img className='logo-menu' src="/imagenes/logoEmpresa.png" alt="Logo" />
        </div>

        <div className='titulo-menu'>
          <h1>Experiencia<br />Coy</h1>
        </div>

        <div className='busqueda-menu'>
          <nav>
            <ul className='lista-menu'>
              <li><Link className='lista-menu-separado' to="/"><b>Inicio</b></Link></li>
              <li><Link className='lista-menu-separado' to="/Acceder"><b>Acceder</b></Link></li>
              <li><Link className='lista-menu-separado' to="/Paquetes"><b>Paquetes</b></Link></li>
              <li><Link className='lista-menu-separado' to="/Contactos"><b>Contactos</b></Link></li>
              <li><Link className='lista-menu-separado' to="/Informacion"><b>Información</b></Link></li>
              <li><Link className='lista-menu-separado' to="/Reservaciones"><b>Reservaciones</b></Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Menu;
