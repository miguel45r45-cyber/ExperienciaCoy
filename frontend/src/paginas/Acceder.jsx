import { useState } from "react";
import Login from "../componentes/compoacceder/Login";//importamos los componentes login y registro
import Registro from "../componentes/compoacceder/Registro";
import "./stylosPaginas/stylelAcceso.css";

function Acceder() {
    const [mostrarLogin, setMostrarLogin] = useState(true);

    //establecemos si mostrar login es tru lo muestra si es fals registro
    return (
    <div className="contenedor-acceso">
        {mostrarLogin ? (
        <div className="login">
            <Login />
            <p className="cambio-formulario">
            ¿No tienes cuenta?{" "}
            <span onClick={() => setMostrarLogin(false)} className="link-cambio">
                Regístrate
            </span>
            </p>
        </div>
        ) : (
        <div className="Registro">
            <Registro />
            <p className="cambio-formulario">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => setMostrarLogin(true)} className="link-cambio">
                Inicia sesión
            </span>
            </p>
        </div>
        )}
    </div>
    );
}

export default Acceder;
