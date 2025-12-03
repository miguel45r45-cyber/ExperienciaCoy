const express = require('express');
const db = require('../dataBase/db');
const PDFDocument = require('pdfkit');

const reservacionesPDF = express.Router();

reservacionesPDF.get('/aprobadas', (req, res) => {
  const { paqueteId, reservacionId } = req.query;

  const fetchPaqueteId = (cb) => {
    if (paqueteId) return cb(null, paqueteId);
    if (!reservacionId) return cb(null, null);
    const sqlPk = 'SELECT paquete_id FROM reservaciones WHERE idReservacion = ?';
    db.query(sqlPk, [reservacionId], (err, rows) => {
      if (err) return cb(err);
      if (!rows.length) return cb(new Error('RESERVACION_NO_ENCONTRADA'));
      cb(null, rows[0].paquete_id);
    });
  };

  fetchPaqueteId((err, resolvedPaqueteId) => {
    if (err) {
      if (err.message === 'RESERVACION_NO_ENCONTRADA') {
        return res.status(404).json({ mensaje: 'Reservación no encontrada' });
      }
      console.error('Error resolviendo paqueteId:', err);
      return res.status(500).json({ error: 'Error resolviendo el paquete de la reservación' });
    }

    const params = [];
    let sql = `
      SELECT 
        r.idReservacion,
        c.nombre   AS nombre_cliente,
        c.ci       AS ci_cliente,
        c.telefono       AS telefono_cliente,
        p.destino  AS destino,
        r.cupos,
        r.montoPagar,
        r.fechaReserva,
        p.idPaquete,
        p.fechaSalida
      FROM reservaciones r
      JOIN paquetes p ON r.paquete_id = p.idPaquete
      JOIN cliente  c ON r.cliente_id = c.cliente_id
      WHERE r.estado = 'aprobada'
    `;

    if (resolvedPaqueteId) {
      sql += ' AND p.idPaquete = ? ORDER BY r.fechaReserva ASC';
      params.push(resolvedPaqueteId);
    } else {
      sql += ' ORDER BY p.idPaquete, r.fechaReserva ASC';
    }

    db.query(sql, params, (err, rows) => {
      if (err) {
        console.error('Error SELECT reservaciones aprobadas:', err);
        return res.status(500).json({ error: 'Error obteniendo reservaciones aprobadas' });
      }

      if (resolvedPaqueteId && rows.length === 0) {
        return res.status(404).json({ mensaje: 'No hay reservaciones aprobadas para este paquete' });
      }

      const doc = new PDFDocument();
      const filename = resolvedPaqueteId
        ? `reservaciones_aprobadas_paquete_${resolvedPaqueteId}.pdf`
        : 'reservaciones_aprobadas.pdf';

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      doc.pipe(res);

      doc.fontSize(18).text('Reservaciones Aprobadas', { align: 'center' });
      doc.moveDown();

      if (resolvedPaqueteId) {
        // Un solo paquete
        const salida = new Date(rows[0].fechaSalida);
        doc.fontSize(16).text(
          `Paquete: ${rows[0].destino} (Salida: ${salida.toLocaleDateString('es-VE')} ${salida.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true })})`,
          { underline: true }
        );
        doc.moveDown();

        rows.forEach((r) => {
          const fechaReserva = new Date(r.fechaReserva);
          doc.fontSize(12).text(
            `Nombre: ${r.nombre_cliente} | CI: ${r.ci_cliente} | Telefono: ${r.telefono_cliente} | Cupos: ${r.cupos} | Monto: ${r.montoPagar} | Fecha: ${fechaReserva.toLocaleDateString('es-VE')} ${fechaReserva.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true })}`
          );
          doc.moveDown();
        });
      } else {
        // Global agrupado por paquete
        let currentPaquete = null;
        rows.forEach((r) => {
          if (currentPaquete !== r.idPaquete) {
            currentPaquete = r.idPaquete;
            const salida = new Date(r.fechaSalida);
            doc.moveDown();
            doc.fontSize(16).text(
              `Paquete: ${r.destino} (Salida: ${salida.toLocaleDateString('es-VE')} ${salida.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true })})`,
              { underline: true }
            );
            doc.moveDown();
          }
          const fechaReserva = new Date(r.fechaReserva);
          doc.fontSize(12).text(
            `ID: ${r.idReservacion} | Nombre: ${r.nombre_cliente} | CI: ${r.ci_cliente} | Cupos: ${r.cupos} | Monto: ${r.montoPagar} | Fecha: ${fechaReserva.toLocaleDateString('es-VE')} ${fechaReserva.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true })}`
          );
          doc.moveDown();
        });
      }

      doc.end();
    });
  });
});

/**
 * Descargar PDF de reservaciones aprobadas por idPaquete en la URL
 * Ejemplo: GET /api/reservaciones-pdf/aprobadas/1
 */
reservacionesPDF.get('/aprobadas/:idPaquete', (req, res) => {
  const { idPaquete } = req.params;

  const sql = `
    SELECT r.idReservacion, c.nombre AS nombre_cliente, c.ci AS ci_cliente,
           p.destino, r.cupos, r.montoPagar, r.fechaReserva, p.fechaSalida
    FROM reservaciones r
    JOIN paquetes p ON r.paquete_id = p.idPaquete
    JOIN cliente c ON r.cliente_id = c.cliente_id
    WHERE r.estado = 'aprobada' AND p.idPaquete = ?
    ORDER BY r.fechaReserva ASC
  `;

  db.query(sql, [idPaquete], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error obteniendo reservaciones aprobadas" });
    if (rows.length === 0) return res.status(404).json({ mensaje: "No hay reservaciones aprobadas para este paquete" });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reservaciones_aprobadas_paquete_${idPaquete}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Reservaciones Aprobadas", { align: "center" });
    doc.moveDown();

    const paquete = rows[0];
    const salida = new Date(paquete.fechaSalida);
    doc.fontSize(16).text(
      `Paquete: ${paquete.destino} (Salida: ${salida.toLocaleDateString("es-VE")} ${salida.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: true })})`,
      { underline: true }
    );
    doc.moveDown();

    rows.forEach((r) => {
      const fechaReserva = new Date(r.fechaReserva);
      doc.fontSize(12).text(
        `ID: ${r.idReservacion} | Nombre: ${r.nombre_cliente} | CI: ${r.ci_cliente} | Cupos: ${r.cupos} | Monto: ${r.montoPagar} | Fecha: ${fechaReserva.toLocaleDateString("es-VE")} ${fechaReserva.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: true })}`
      );
      doc.moveDown();
    });

    doc.end();
  });
});

module.exports = reservacionesPDF;
