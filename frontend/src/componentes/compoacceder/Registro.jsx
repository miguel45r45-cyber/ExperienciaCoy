import { useState, useContext } from 'react';
import "../compoacceder/styleRegistro.css";
import { UserContext } from "../../UserContext";

export default function Register({ onRegistroExitoso }) {
  const { login } = useContext(UserContext);

  const [form, setForm] = useState({
    ci: '',
    nombre: '',
    telefono: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos vacíos
    for (const campo in form) {
      if (!form[campo]) {
        alert('Te falta llenar uno o más campos');
        return;
      }
    }

    if (form.telefono.length <= 10) {
      alert('Le faltan datos en su número telefónico');
      return;
    }

    if (form.ci.length <= 7) {
      alert('Le faltan datos en su número de cédula');
      return;
    }

    if (form.contrasena.length <= 7) {
      alert('Su contraseña tiene que tener 8 o más caracteres');
      return;
    }

    // Validar contraseñas iguales
    if (form.contrasena !== form.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/autentificador/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        // ⚡ El backend debe devolver cliente_id (result.insertId)
        const user = {
          cliente_id: data.cliente_id, // 👈 importante
          ci: form.ci,
          nombre: form.nombre,
          telefono: form.telefono,
          correo: form.correo,
          rol: 'cliente'
        };

        // Guardamos en contexto
        login(user, data.token);

        // Callback opcional
        if (onRegistroExitoso) {
          onRegistroExitoso(data.cliente_id);
        }
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className='contenedor-registro'>
      <h1 className="titulo-registro">Registro</h1>
      <div className='containerRegistrar'>
        <form onSubmit={handleSubmit} className="form-camba">
          <label className='nombreCampo'>Cédula
            <input className='campo-informacion' name="ci" placeholder="Cédula" onChange={handleChange} />
          </label>
          <label className='nombreCampo'>Nombre y Apellido
            <input className='campo-informacion' name="nombre" placeholder="Nombre y Apellido" onChange={handleChange} />
          </label>
          <label className='nombreCampo'>Teléfono
            <input className='campo-informacion' name="telefono" placeholder="Teléfono" onChange={handleChange} />
          </label>
          <label className='nombreCampo'>Correo
            <input className='campo-informacion' name="correo" type="email" placeholder="Correo" onChange={handleChange} />
          </label>
          <label className='nombreCampo'>Contraseña
            <input className='campo-informacion' name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} />
          </label>
          <label className='nombreCampo'>Confirmar Contraseña
            <input className='campo-informacion' name="confirmarContrasena" type="password" placeholder="Confirmar Contraseña" onChange={handleChange} />
          </label>
          <button className='boton-envio' type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}
