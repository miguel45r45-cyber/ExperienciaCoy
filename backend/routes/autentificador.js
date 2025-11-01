const express = require('express');//framwork para manejar las rutas
const bcrypt = require('bcryptjs');//usamos una libreria de encriptacion para que las contraseñas se guarden seguras
const db = require('../dataBase/db');//importamos la db

const router = express.Router();//crea rutas para manejar el registro y el login

// Credenciales fijas para el admin
const ADMIN_CREDENCIALES = {
    correo: 'adminexperienciacoy@gmail.com',
    contrasena: 'admin2025/*',
    nombre: 'Administrador',
    rol: 'admin'
};

// Registro de usuario normal
router.post('/register', async (req, res) => {//usamos req para obtener lo que el cliente coloque y req para lo que se ejecutara en el servidor 
    const { ci, nombre, telefono, correo, contrasena, confirmarContrasena } = req.body;//establecemos campos

    if (!ci || !nombre || !telefono || !correo || !contrasena || !confirmarContrasena) {
    return res.status(400).json({ message: 'Te falta llenar uno o más campos' });
    }//si falta un campo se muestra un error

    if (contrasena !== confirmarContrasena) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }//verificamos que sean las mismas contraseñas

    try {// usamos try para establecer como se registran los datos del usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);//usamos salt para los valores aleatorios y bcrypt para encriptar la contraseña

    const sql = 'INSERT INTO usuario (ci, nombre, telefono, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)';// insertamos los valores del usuario en la db
    db.query(sql, [ci, nombre, telefono, correo, hashedPassword, 'usuario'], (err, result) => {
        if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
    } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Login con detección de admin
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {//verifica que no falte ningun campo
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

  // Verificación de admin
    if (correo === ADMIN_CREDENCIALES.correo && contrasena === ADMIN_CREDENCIALES.contrasena) {
    return res.status(200).json({
        message: 'Inicio de sesión como administrador exitoso',
        user: {
        nombre: ADMIN_CREDENCIALES.nombre,
        correo: ADMIN_CREDENCIALES.correo,
        rol: ADMIN_CREDENCIALES.rol
        }
    });
    }

  // Login normal desde base de datos
  const sql = 'SELECT * FROM usuario WHERE correo = ?';//establecemos posibles casos con errores comnes al iniciar seccion
    db.query(sql, [correo], async (err, results) => {
    if (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({// guarda los datos en una variabel flotante para aceder a ellos luego
        message: 'Inicio de sesión exitoso',
        user: {
        ci: user.ci,
        nombre: user.nombre,
        telefono: user.telefono,
        correo: user.correo,
        rol: user.rol
        }
    });
    });
});

module.exports = router;
