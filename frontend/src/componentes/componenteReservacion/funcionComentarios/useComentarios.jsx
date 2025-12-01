import axios from "axios";
import { useState } from "react";

export function useComentarios(token) {
    const [loading, setLoading] = useState(false);

    const cargarComentarios = async (idReservacion) => {
    try {
        const res = await axios.get(
        `http://localhost:5000/api/seguimiento/${idReservacion}`,
        { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (err) {
        console.error("Error cargando comentarios:", err);
        return [];
    }
    };

    const guardarComentario = async (idReservacion, comentario) => {
    try {
        setLoading(true);
        await axios.post(
        "http://localhost:5000/api/seguimiento",
        { idReservacion, comentario },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        const nuevos = await cargarComentarios(idReservacion);
        return nuevos;
    } catch (err) {
        console.error("Error guardando comentario:", err);
        return [];
    } finally {
        setLoading(false);
    }
    };

    return { cargarComentarios, guardarComentario, loading };
}
