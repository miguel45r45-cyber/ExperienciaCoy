import { useState } from 'react';
import "../compoacceder/styleRegistro.css"

export default function Register() {///guardamos los datos que el cliente escribe escribe
    const [form, setForm] = useState({
    ci: '',
    nombre: '',
    telefono: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    });

    const handleChange = (e) => {//para actualizar los campos
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();//evita que la pagina se recargue 

    for (const campo in form) {//verifica que todos los campos esten llenos
        if (!form[campo]) {
        alert('Te falta llenar uno o más campos');
        return;
        }
    }

    if (form.contrasena !== form.confirmarContrasena) {//verifica que las contraseñas sean las mismas
        alert('Las contraseñas no coinciden');
        return;
    }

    try {//envia los datos al servidor con el usu de await para evitar que se salte el paso
        const res = await fetch('http://192.168.1.163:5000/api/autentificador/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        });

        const data = await res.json();
        alert(data.message);
    } catch (error) {//mesnaje de error en aso de que no funcione
        alert('Error al conectar con el servidor');
    }
    };
//formulario
    return (
    <div className='contenedor-registro' >
        <form onSubmit={handleSubmit} className="form-camba">
            <h1 className="titulo-registro">Registro</h1>
            <input className='campo-informacion' name="ci" placeholder="Cédula" onChange={handleChange} />
            <input className='campo-informacion' name="nombre" placeholder="Nombre y  Apellido" onChange={handleChange} />
            <input className='campo-informacion' name="telefono" placeholder="Teléfono" onChange={handleChange} />
            <input className='campo-informacion' name="correo" type="email" placeholder="Correo" onChange={handleChange} />
            <input className='campo-informacion' name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} />
            <input className='campo-informacion' name="confirmarContrasena" type="password" placeholder="Confirmar Contraseña" onChange={handleChange} />
            <button className='boton-envio' type="submit">Registrarse</button>
        </form>
    </div>
    );
}
