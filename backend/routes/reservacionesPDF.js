// backend/routes/reservacionesPDF.js
const express = require('express');
const db = require('../dataBase/db');
const PDFDocument = require('pdfkit');

const reservacionesPDF = express.Router();

reservacionesPDF.get('/aprobadas', (req, res) => {
  const sql = "SELECT * FROM reservaciones WHERE estado = 'aprobada'";
    db.query(sql, (err, rows) => {
    if (err) {
        console.error("Error SELECT reservaciones aprobadas:", err);
        return res.status(500).json({ error: "Error obteniendo reservaciones aprobadas" });
    }

    // Crear PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reservaciones_aprobadas.pdf');
    doc.pipe(res);

    doc.fontSize(18).text("Reservaciones Aprobadas", { align: "center" });
    doc.moveDown();

    rows.forEach((r) => {
        doc.fontSize(12).text(
        `ID: ${r.idReservacion} | Nombre: ${r.nombre_cliente} | CI: ${r.ci_cliente} | Destino: ${r.destino} | Cupos: ${r.cupos} | Monto: ${r.montoPagar} | Fecha: ${new Date(r.fechaReserva).toLocaleString("es-VE")}`
        );
        doc.moveDown();
    });

    doc.end();
    });
});

module.exports = reservacionesPDF;
