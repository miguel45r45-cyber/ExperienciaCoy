const express = require('express');
const reservacionesAgrupadas = express.Router();
const db = require('../dataBase/db');
const { verificarToken } = require('../verificador/autorizador');

// Ruta única: admin ve todas, cliente ve solo las suyas
reservacionesAgrupadas.get('/', verificarToken, (req, res) => {
  const { rol, cliente_id } = req.user || {};

  let sql = `
    SELECT r.idReservacion, r.cliente_id, r.nombre_cliente, r.ci_cliente, r.telefono_cliente,
    r.correo_cliente, r.cupos, r.montoPagar, r.formaPago, r.fechaReserva,
    p.idPaquete, p.destino AS paqueteDestino, p.fechaSalida
    FROM reservaciones r
    JOIN paquetes p ON r.paquete_id = p.idPaquete
  `;

  const valores = [];

  // 🔑 Si no es admin, filtramos por cliente_id
  if (rol !== 'admin') {
    if (!cliente_id) {
      return res.status(400).json({ mensaje: "Token inválido: falta cliente_id" });
    }
    sql += ` WHERE r.cliente_id = ?`;
    valores.push(cliente_id);
  }

  sql += ` ORDER BY p.idPaquete, r.fechaReserva ASC`;

  db.query(sql, valores, (err, results) => {
    if (err) {
      console.error("Error SELECT agrupadas:", err);
      return res.status(500).json({ mensaje: "Error al obtener reservaciones agrupadas" });
    }

    // Agrupamos por paquete
    const agrupadas = {};
    results.forEach(r => {
      if (!agrupadas[r.idPaquete]) {
        agrupadas[r.idPaquete] = {
          paquete: {
            idPaquete: r.idPaquete,
            destino: r.paqueteDestino,
            fechaSalida: r.fechaSalida
          },
          reservaciones: []
        };
      }
      agrupadas[r.idPaquete].reservaciones.push({
        idReservacion: r.idReservacion,
        cliente_id: r.cliente_id,
        nombre_cliente: r.nombre_cliente,
        ci_cliente: r.ci_cliente,
        telefono_cliente: r.telefono_cliente,
        correo_cliente: r.correo_cliente,
        cupos: r.cupos,
        montoPagar: r.montoPagar,
        formaPago: r.formaPago,
        fechaReserva: r.fechaReserva
      });
    });

    res.json(Object.values(agrupadas));
  });
});

module.exports = reservacionesAgrupadas;
