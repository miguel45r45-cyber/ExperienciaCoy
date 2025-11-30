const express = require("express");
const db = require("../dataBase/db");

const metodoPago = express.Router();

// GET: listar todos los métodos de pago
metodoPago.get("/", (req, res) => {
  db.query("SELECT * FROM metodo_pago", (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener métodos de pago" });
    res.json(results);
  });
});

// GET: listar solo métodos activos
metodoPago.get("/activos", (req, res) => {
  db.query("SELECT * FROM metodo_pago WHERE activo = 1", (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener métodos activos" });
    res.json(results);
  });
});

// POST: crear un nuevo método de pago
metodoPago.post("/", (req, res) => {
  const { formaPago } = req.body;
  if (!formaPago) return res.status(400).json({ mensaje: "Debe indicar formaPago" });

  db.query("INSERT INTO metodo_pago (formaPago, activo) VALUES (?, 1)", [formaPago], (err, result) => {
    if (err) return res.status(500).json({ mensaje: "Error al insertar método de pago" });
    res.status(201).json({ mensaje: "Método de pago agregado", id: result.insertId });
  });
});

// PUT: editar un método de pago
metodoPago.put("/:id", (req, res) => {
  const { formaPago } = req.body;
  const { id } = req.params;
  if (!formaPago) return res.status(400).json({ mensaje: "Debe indicar formaPago" });

  db.query("UPDATE metodo_pago SET formaPago = ? WHERE idMetodoPago = ?", [formaPago, id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al actualizar método de pago" });
    res.json({ mensaje: "Método de pago actualizado" });
  });
});

// PATCH: inactivar un método de pago
metodoPago.patch("/:id/inactivar", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE metodo_pago SET activo = 0 WHERE idMetodoPago = ?", [id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al inactivar método de pago" });
    res.json({ mensaje: "Método de pago inactivado" });
  });
});

// PATCH: reactivar un método de pago
metodoPago.patch("/:id/reactivar", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE metodo_pago SET activo = 1 WHERE idMetodoPago = ?", [id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al reactivar método de pago" });
    res.json({ mensaje: "Método de pago reactivado" });
  });
});

// DELETE: eliminar un método de pago
metodoPago.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM metodo_pago WHERE idMetodoPago = ?", [id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar método de pago" });
    res.json({ mensaje: "Método de pago eliminado" });
  });
});

module.exports = metodoPago;
