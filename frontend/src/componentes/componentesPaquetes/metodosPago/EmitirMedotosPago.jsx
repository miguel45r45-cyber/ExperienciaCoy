import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../UserContext";
import "../StylePaquetes.css";

export default function PublicarMetodoPago() {
  const { token } = useContext(UserContext);
  const [formaPago, setFormaPago] = useState("");
  const [loading, setLoading] = useState(false);
  const [metodos, setMetodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Cargar métodos de pago
  const fetchMetodos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/metodo_pago", {
        headers: { Authorization: token ? "Bearer " + token : undefined },
      });
      const data = await res.json();
      if (res.ok) setMetodos(data);
    } catch (error) {
      alert("Error al obtener métodos de pago");
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formaPago.trim()) return alert("Debe ingresar una forma de pago");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/metodo_pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? "Bearer " + token : undefined,
        },
        body: JSON.stringify({ formaPago }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormaPago("");
        fetchMetodos();
      } else {
        alert(data.mensaje);
      }
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Funciones para botones
  const startEdit = (id, currentValue) => {
    setEditId(id);
    setEditValue(currentValue);
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:5000/api/metodo_pago/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formaPago: editValue }),
    });
    setEditId(null);
    setEditValue("");
    fetchMetodos();
  };

  const inactivarMetodo = async (id) => {
    await fetch(`http://localhost:5000/api/metodo_pago/${id}/inactivar`, { method: "PATCH" });
    fetchMetodos();
  };

  const reactivarMetodo = async (id) => {
    await fetch(`http://localhost:5000/api/metodo_pago/${id}/reactivar`, { method: "PATCH" });
    fetchMetodos();
  };

  const eliminarMetodo = async (id) => {
    await fetch(`http://localhost:5000/api/metodo_pago/${id}`, { method: "DELETE" });
    fetchMetodos();
  };

  return (
    <div className="bloqueDeCreacion">
      <h2 className="TituloCampo">Registrar Método de Pago</h2>
      <form onSubmit={onSubmit}>
        <input className="camposCreacion"
          type="text"
          value={formaPago}
          onChange={(e) => setFormaPago(e.target.value)}
          placeholder="Ej: Transferencia, Tarjeta, Efectivo"
        />
        <button className="BotonesPaquetes" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>

      <h3 className="NombreInfo">Listado de Métodos de Pago</h3>
      <ul>
        {metodos.map((m) => (
          <li className="NombreInfo" key={m.idMetodoPago}>
            {editId === m.idMetodoPago ? (
              <>
                <input className="camposCreacion"
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button className="BotonesPaquetes" onClick={() => saveEdit(m.idMetodoPago)}>Guardar</button>
                <button className="BotonesPaquetes" onClick={() => setEditId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {m.formaPago} {m.activo === 0 ? "(inactivo)" : ""}
                <button className="BotonesPaquetes" onClick={() => startEdit(m.idMetodoPago, m.formaPago)}>Editar</button>
                {m.activo === 1 ? (
                  <button className="BotonesPaquetes" onClick={() => inactivarMetodo(m.idMetodoPago)}>Inactivar</button>
                ) : (
                  <button className="BotonesPaquetes" onClick={() => reactivarMetodo(m.idMetodoPago)}>Reactivar</button>
                )}
                <button className="BotonesPaquetes" onClick={() => eliminarMetodo(m.idMetodoPago)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
