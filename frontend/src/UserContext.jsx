import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

  // Al iniciar, carga datos guardados en localStorage
    useEffect(() => {
    const guardado = localStorage.getItem("cliente");
    const guardadoToken = localStorage.getItem("token");

    if (guardado) setUser(JSON.parse(guardado));
    if (guardadoToken) setToken(guardadoToken);
    }, []);

  // Función para login
    const login = (cliente, jwtToken) => {
    localStorage.setItem("cliente", JSON.stringify(cliente));
    localStorage.setItem("token", jwtToken);
    setUser(cliente);
    setToken(jwtToken);
    };

  // Función para logout
    const logout = () => {
    localStorage.removeItem("cliente");
    localStorage.removeItem("token");
    window.location.reload();
    setUser(null);
    setToken(null);
    };

    return (
    <UserContext.Provider value={{ user, token, login, logout }}>
        {children}
    </UserContext.Provider>
    );
}
