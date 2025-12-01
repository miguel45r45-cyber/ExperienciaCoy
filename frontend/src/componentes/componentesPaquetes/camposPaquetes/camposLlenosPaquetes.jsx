export function getCamposVisibles(paquete) {
  const campos = {
    Hora: paquete.hora,
    Transporte: paquete.transporte,
    Traslado: paquete.traslado,
    Servicios: paquete.servicios,
    Alimentación: paquete.alimentacion,
    Bebidas: paquete.bebidas,
    Actividades: paquete.actividades,
    Precio: paquete.monto ? `$${paquete.monto}` : null,
    Estado: paquete.activo === 1 ? "Activo" : "Inactivo",
  };

  return Object.entries(campos).filter(([_, valor]) => valor && valor !== "");
}

export function onChangeCampo(id, campo, valor, setPaquetes) {
  setPaquetes((prev) =>
    prev.map((pa) => (pa.idPaquete === id ? { ...pa, [campo]: valor } : pa))
  );
}

export function onChangeImagen(id, file, setPaquetes) {
  setPaquetes((prev) =>
    prev.map((pa) => (pa.idPaquete === id ? { ...pa, imagen: file } : pa))
  );
}
