import { useState } from "react";
import "../compoacceder/styleRegistro.css"

export default function RecuperarClave() {
  const [correo, setCorreo] = useState("");
  const [pregunta, setPregunta] = useState(null);
  const [clienteId, setclienteId] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [repitaContrasena, setRepitaContrasena] = useState("");

  const buscarPregunta = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/seguridad/${correo}`);
      const data = await res.json();
      if (res.ok) {
        setPregunta(data.pregunta);
        setclienteId(data.cliente_id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  const cambiarClave = async (e) => {
    e.preventDefault(); // evita recargar la página
    window.location.reload();

    if (nuevaContrasena !== repitaContrasena) {
      alert("Contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: clienteId, respuesta, nuevaContrasena }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <h2 className="tituloRecuperarClaveCorreo">Recuperar Contraseña</h2>
      {!pregunta ? (
        <div className="containerBuscarCorreo">
          <label className="nombreCampo">
            Ingrese correo electrónico
            <input
              className="campo-informacion"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo"
            />
          </label>
          <button className="boton_buscarPregunta" onClick={buscarPregunta}>
            Buscar pregunta
          </button>
        </div>
      ) : (
        <>
          <div className="containerCambioClave">
              <p className="pregunta">Su pregunta es: ¿{pregunta}?</p>
              <input
                className="campo-informacion"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Respuesta"
              />
              <form onSubmit={cambiarClave}>
                <label className="nombreCampo"> Ingrese su nueva contraseña
                  <input
                    className="campo-informacion"
                    type="password"
                    name="nuevaContraseña"
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                    placeholder="Nueva contraseña"
                  />
                </label>
    
                <label className="nombreCampo">  Repita su nueva contraseña
                  <input
                    className="campo-informacion"
                    type="password"
                    name="repitaNuevaContraseña"
                    value={repitaContrasena}
                    onChange={(e) => setRepitaContrasena(e.target.value)}
                    placeholder="Repita nueva contraseña"
                  />
                </label>
    
                <button className="boton_Cambio" type="submit">Cambiar contraseña</button>
              </form>
          </div>
        </>
      )}
    </div>
  );
}
