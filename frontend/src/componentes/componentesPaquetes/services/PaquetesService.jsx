const API_URL = "http://localhost:5000/api/paquetes";

export async function fetchPaquetes() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function eliminarPaquete(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}

export async function guardarEdicion(paquete, campoEditando, token) {
  const fd = new FormData();
  if (campoEditando === "imagen") {
    fd.append("imagen", paquete.imagen);
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
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}

export async function reactivarPaquete(id, token) {
  const res = await fetch(`${API_URL}/${id}/reactivar`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}
