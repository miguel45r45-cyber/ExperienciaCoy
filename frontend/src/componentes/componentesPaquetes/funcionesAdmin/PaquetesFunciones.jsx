const API_URL = "http://localhost:5000/api/paquetes";

export async function fetchPaquetes() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function eliminarPaquete(id, token) {
  // Primero verificar
  const check = await fetch(`${API_URL}/${id}/reservaciones/check`, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await check.json();

  if (data.tieneReservaciones) {
    return { mensaje: "No se puede eliminar: el paquete tiene reservaciones activas. Usa Inactivar." };
  }

  // Si no tiene reservaciones, eliminar
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}


export async function guardarEdicion(paquete, campoEditando, token) {
  const fd = new FormData();
  if (campoEditando === "imagen_url") {
    fd.append("imagen", paquete.imagen_url); // ✅ backend espera imagen_url
  } else {
    fd.append(campoEditando, paquete[campoEditando] ?? "");
  }

  const res = await fetch(`${API_URL}/${paquete.idPaquete}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
    body: fd,
  });
  return res.json();
}

export async function inactivarPaquete(id, token) {
  const res = await fetch(`${API_URL}/${id}/inactivar`, {
    method: "PATCH", // ✅ backend espera PATCH
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}

export async function reactivarPaquete(id, token) {
  const res = await fetch(`${API_URL}/${id}/reactivar`, {
    method: "PATCH", // ✅ backend espera PATCH
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}
