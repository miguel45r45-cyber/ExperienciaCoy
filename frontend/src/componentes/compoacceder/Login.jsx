import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../UserContext"; // importa tu contexto global
import "../compoacceder/styleRegistro.css";

export default function Login() {
    const [form, setForm] = useState({
    correo: "",
    contrasena: "",
    });

  const { login } = useContext(UserContext); // usamos la función login del contexto

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.correo || !form.contrasena) {
        alert("Correo y contraseña son obligatorios");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/autentificador/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        });

        const data = await res.json();
        alert(data.message);
        window.location.reload();

        if (res.ok) {
        // usamos el contexto para guardar user + token
        login(data.user, data.token);
        }
    } catch (error) {
        alert("Error al conectar con el servidor");
    }
};

    return (
    <div className="contenedor-registro">
        <form onSubmit={handleSubmit} className="form-camba">
        <h1 className="titulo-login ">Iniciar sesión</h1>
            <div className="containerLogin">
                <label className="nombreCampo">
                    Correo Electrónico
                <input
                    className="campo-informacion"
                    name="correo"
                    type="email"
                    placeholder="Correo"
                    onChange={handleChange}
                />
                </label>
                <label className="nombreCampo">
                    Contraseña
                    <input
                    className="campo-informacion"
                    name="contrasena"
                    type="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                />
                </label>
                    <button className="boton-envio" type="submit">
                        Entrar
                    </button>
            </div>
        </form>
    </div>
    );
}
