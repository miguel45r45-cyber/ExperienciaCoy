// Devuelve los campos visibles de un paquete para mostrar en UI
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
    Estado: paquete.estadoPaqueteActivo === true ? "Activo" : "Inactivo", // ✅ refleja el backend boolean
  };

  // Filtra solo los campos con valores no nulos ni vacíos
  return Object.entries(campos).filter(([_, valor]) => valor && valor !== "");
}

// Actualiza un campo específico de un paquete en el estado local
export function onChangeCampo(id, campo, valor, setPaquetes) {
  setPaquetes((prev) =>
    prev.map((pa) =>
      pa.idPaquete === id ? { ...pa, [campo]: valor } : pa
    )
  );
}

// Actualiza la imagen de un paquete en el estado local
export function onChangeImagen(id, file, setPaquetes) {
  setPaquetes((prev) =>
    prev.map((pa) =>
      pa.idPaquete === id ? { ...pa, imagen_url: file } : pa // ✅ backend espera imagen_url
    )
  );
}
