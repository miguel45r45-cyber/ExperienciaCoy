const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta_segura';

// Middleware general: valida token y guarda datos del cliente (admin o normal)
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
    return res.status(403).json({ mensaje: 'Token requerido' });
    }

    try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // decoded debe contener { cliente_id, rol, ... }
    req.user = decoded; 
    next();
    } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
    }
}

// Middleware específico para admin
function verificarTokenAdmin(req, res, next) {
    verificarToken(req, res, () => {
    if (!req.user || req.user.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
    }
    next();
    });
}

module.exports = { verificarToken, verificarTokenAdmin };
