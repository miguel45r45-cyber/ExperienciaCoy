const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../dataBase/db');

const router = express.Router();
const SECRET_KEY =  'tu_clave_secreta_segura'

// Registro de cliente normal
// Registro de cliente normal
router.post('/register', async (req, res) => {
  const { ci, nombre, telefono, correo, contrasena, confirmarContrasena } = req.body;

  if (!ci || !nombre || !telefono || !correo || !contrasena || !confirmarContrasena) {
    return res.status(400).json({ message: 'Faltan campos por completar' });
  }

  if (contrasena !== confirmarContrasena) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const sql = 'INSERT INTO cliente (ci, nombre, telefono, correo, contrasena) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [ci, nombre, telefono, correo, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al registrar cliente:', err);
        return res.status(500).json({ message: 'Error al registrar cliente. Intenta nuevamente.' });
      }

      // devolvemos el cliente_id recién creado
      res.status(201).json({
        message: 'Cliente registrado exitosamente',
        cliente_id: result.insertId,
        user: {
          cliente_id: result.insertId,
          ci,
          nombre,
          telefono,
          correo,
          rol: 'cliente'
        }
      });
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor. Intenta más tarde.' });
  }
});


// Login para admin y cliente
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const sqlAdmin = 'SELECT * FROM administrador WHERE correo = ?';
    db.query(sqlAdmin, [correo], async (err, resultsAdmin) => {
        if (err) {
            console.error('Error en la consulta de administrador:', err);
            return res.status(500).json({ message: 'Error en el servidor. Intenta más tarde.' });
        }

        if (resultsAdmin.length > 0) {
            const admin = resultsAdmin[0];
            const isMatch = await bcrypt.compare(contrasena, admin.contrasena);

            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Token para admin
            const token = jwt.sign(
                { rif: admin.rif, nombre: admin.nombre, correo: admin.correo, rol: 'admin' },
                SECRET_KEY,
                { expiresIn: '2h' }
            );

            return res.status(200).json({
                message: 'Inicio de sesión como administrador exitoso',
                token,
                user: {
                    rif: admin.rif,
                    nombre: 'Admin',
                    correo: admin.correo,
                    rol: 'admin'
                }
            });
        }

        const sqlUser = 'SELECT * FROM cliente WHERE correo = ?';
        db.query(sqlUser, [correo], async (err, resultsUser) => {
            if (err) {
                console.error('Error en la consulta de cliente:', err);
                return res.status(500).json({ message: 'Error en el servidor. Intenta más tarde.' });
            }

            if (resultsUser.length === 0) {
                return res.status(401).json({ message: 'cliente no encontrado' });
            }

            const user = resultsUser[0];
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);

            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Token para cliente: ahora sí incluye cliente_id
            const token = jwt.sign(
                { cliente_id: user.cliente_id, correo: user.correo, rol: 'cliente' },
                SECRET_KEY,
                { expiresIn: '2h' }
            );

            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    cliente_id: user.cliente_id,
                    ci: user.ci,
                    nombre: user.nombre,
                    telefono: user.telefono,
                    correo: user.correo,
                    rol: 'cliente'
                }
            });
        });
    });
});

module.exports = router;
