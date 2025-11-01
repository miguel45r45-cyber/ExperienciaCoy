import { useState, useEffect } from 'react';//useState guarda los datos del usuario y useeffect extrae los datos si estan guardados
import "../compoacceder/styleRegistro.css"

export default function Login() {
    const [form, setForm] = useState({//para guardar los datos que escribe el usuario
    correo: '',
    contrasena: '',
    });

    const [usuario, setUsuario] = useState(null);//guarda los datos del usaurio si logro entrar

    const handleChange = (e) => {//actualiza los datos
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();//evita que se recargue la pagina

    if (!form.correo || !form.contrasena) {
        alert('Correo y contraseña son obligatorios');
        return;
    }//por si falta un campo

    try {
        const res = await fetch('http://192.168.1.163:5000/api/autentificador/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        });//envia los datos con fetch con metodo post cpnbirtiendo el formulario en json 

        const data = await res.json();//convierte el mensaje en json
        alert(data.message);//muestra mensaje aler
        window.location.reload();//actualiza la pagina


        if (res.ok) {
        setUsuario(data.user); // guarda en los datos del usuario
        localStorage.setItem('usuario', JSON.stringify(data.user)); // guarda en localStorage
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
    }
    };

    useEffect(() => {//verifica si usuario esta guardado y lo carga
    const guardado = localStorage.getItem('usuario');
    if (guardado) {
        setUsuario(JSON.parse(guardado));
    }
    }, []);

    return (
    <div className='contenedor-registro' >
        <form onSubmit={handleSubmit} className="form-camba">
            <h1 className="titulo-login">Iniciar sesión</h1>
            <input className='campo-informacion' name="correo" type="email" placeholder="Correo" onChange={handleChange} />
            <input className='campo-informacion' name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} />
            <button className='boton-envio' type="submit">Entrar</button>
        </form>
    </div>
    );
}
