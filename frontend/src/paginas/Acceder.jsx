import { useState } from "react";
import Login from "../componentes/compoacceder/Login";
import Registro from "../componentes/compoacceder/Registro";
import CrearPreguntaSeguridad from "../componentes/compoacceder/CrearPreguntaSeguridad"; 
import RecuperarClave from "../componentes/compoacceder/RecuperarClave"; 
import "./stylosPaginas/stylelAcceso.css";

function Acceder() {
  const [vista, setVista] = useState("login"); // login | registro | pregunta | recuperar
  const [clienteId, setclienteId] = useState(null);

  // Cuando el registro es exitoso, pasamos al formulario de pregunta
  const handleRegistroExitoso = (nuevoclienteId) => {
    setclienteId(nuevoclienteId);
    setVista("pregunta");
  };

  return (
    <div className="contenedor-acceso">
      {vista === "login" && (
        <div className="login">
          <Login />
          <p className="cambio-formulario">
            ¿No tienes cuenta?{" "}
            <span onClick={() => setVista("registro")} className="link-cambio">
              Regístrate
            </span>
          </p>
          <p className="cambio-formulario">
            ¿Olvidaste tu contraseña?{" "}
            <span onClick={() => setVista("recuperar")} className="link-cambio">
              Recuperar clave
            </span>
          </p>
        </div>
      )}

      {vista === "registro" && (
        <div className="Registro">
          <Registro onRegistroExitoso={handleRegistroExitoso} />
          <p className="cambio-formulario">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => setVista("login")} className="link-cambio">
              Inicia sesión
            </span>
          </p>
        </div>
      )}

      {vista === "pregunta" && (
        <div className="PreguntaSeguridad">
          <CrearPreguntaSeguridad cliente_id={clienteId} />
          <p className="cambio-formulario">
            ¿Ya configuraste tu pregunta?{" "}
            <span onClick={() => setVista("login")} className="link-cambio">
              Ir al login
            </span>
          </p>
        </div>
      )}

      {vista === "recuperar" && (
        <div className="RecuperarClave">
          <RecuperarClave />
          <p className="cambio-formulario">
            ¿Ya recuerdas tu contraseña?{" "}
            <span onClick={() => setVista("login")} className="link-cambio">
              Inicia sesión
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Acceder;
