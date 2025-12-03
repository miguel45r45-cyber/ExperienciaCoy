const express = require('express');
const db = require('../dataBase/db');
const PDFDocument = require('pdfkit');

const reservacionesPDF = express.Router();

// Ruta con parámetro dinámico
reservacionesPDF.get('/aprobadas/:idPaquete', (req, res) => {
  const { idPaquete } = req.params;

  const sql = `
    SELECT 
      r.idReservacion,
      r.cliente_id,
      c.nombre   AS nombre_cliente,
      c.ci       AS ci_cliente,
      p.destino  AS destino,
      r.cupos,
      r.montoPagar,
      r.fechaReserva,
      p.idPaquete,
      p.fechaSalida
    FROM reservaciones r
    JOIN paquetes p ON r.paquete_id = p.idPaquete
    JOIN cliente c ON r.cliente_id = c.cliente_id
    WHERE r.estado = 'aprobada' AND p.idPaquete = ?
    ORDER BY r.fechaReserva ASC
  `;

  db.query(sql, [idPaquete], (err, rows) => {
    if (err) {
      console.error("Error SELECT reservaciones aprobadas:", err);
      return res.status(500).json({ error: "Error obteniendo reservaciones aprobadas" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "No hay reservaciones aprobadas para este paquete" });
    }

    // Crear PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reservaciones_aprobadas_paquete_${idPaquete}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(18).text("Reservaciones Aprobadas", { align: "center" });
    doc.moveDown();

    const salida = new Date(rows[0].fechaSalida);
    doc.fontSize(16).text(
      `Paquete: ${rows[0].destino} (Salida: ${salida.toLocaleDateString("es-VE")} ${salida.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: true })})`,
      { underline: true }
    );
    doc.moveDown();

    rows.forEach((r) => {
      const fechaReserva = new Date(r.fechaReserva);
      doc.fontSize(12).text(
        ` Nombre: ${r.nombre_cliente} | CI: ${r.ci_cliente} | Cupos: ${r.cupos} | Monto: ${r.montoPagar} | Fecha: ${fechaReserva.toLocaleDateString("es-VE")} ${fechaReserva.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: true })}`
      );
      doc.moveDown();
    });

    doc.end();
  });
});

module.exports = reservacionesPDF;

