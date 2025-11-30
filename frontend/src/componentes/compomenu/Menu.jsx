import { useContext } from "react";
import { Link } from "react-router-dom";
import "../compomenu/StyleMenu.css";
import { UserContext } from "../../UserContext";

function Menu() {
  const { user, logout } = useContext(UserContext);

  return (
    <>
      {user && (
        <div className="bienvenida-usuario">
          <span className="mensajeBienbenida">Bienvenido, {user.nombre}</span>
          <button className="botonCerrarSesion" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}

      <div className="contenedor-menu-principal separacion-menu">
        <div>
          <img className="logo-menu" src="/imagenes/logoEmpresa.png" alt="Logo" />
        </div>

        <div className="titulo-menu">
          <h1>
            Experiencia
            <br />
            Coy
          </h1>
        </div>

        <div className="busqueda-menu">
          <nav>
            <ul className="lista-menu">
              <li>
                <Link className="lista-menu-separado" to="/">
                  <b>Inicio</b>
                </Link>
              </li>
              <li>
                <Link className="lista-menu-separado" to="/Acceder">
                  <b>Acceder</b>
                </Link>
              </li>
              <li>
                <Link className="lista-menu-separado" to="/Paquetes">
                  <b>Paquetes</b>
                </Link>
              </li>
              <li>
                <Link className="lista-menu-separado" to="/Contactos">
                  <b>Contactos</b>
                </Link>
              </li>
              <li>
                <Link className="lista-menu-separado" to="/Informacion">
                  <b>Información</b>
                </Link>
              </li>
              <li>
                <Link className="lista-menu-separado" to="/Reservaciones">
                  <b>Reservaciones</b>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Menu;
