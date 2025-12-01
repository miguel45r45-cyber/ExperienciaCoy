import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

function decodeRol(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload?.rol || null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);

  // Al iniciar, carga datos guardados en localStorage
  useEffect(() => {
    const guardado = localStorage.getItem("cliente");
    const guardadoToken = localStorage.getItem("token");

    if (guardado) setUser(JSON.parse(guardado));
    if (guardadoToken) {
      setToken(guardadoToken);
      setRol(decodeRol(guardadoToken)); // decodifica rol al cargar
    }
  }, []);

  // Función para login
  const login = (cliente, jwtToken) => {
    localStorage.setItem("cliente", JSON.stringify(cliente));
    localStorage.setItem("token", jwtToken);
    setUser(cliente);
    setToken(jwtToken);
    setRol(decodeRol(jwtToken)); // decodifica rol al hacer login
  };

  // Función para logout
  const logout = () => {
    localStorage.removeItem("cliente");
    localStorage.removeItem("token");
    window.location.reload();
    setUser(null);
    setToken(null);
    setRol(null);
  };

  return (
    <UserContext.Provider value={{ user, token, rol, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
