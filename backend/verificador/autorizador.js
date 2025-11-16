const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta_segura';

function verificarTokenAdmin(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

    try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
    }
    req.user = decoded; // guarda datos del admin en la request
    next(); // deja pasar a la ruta
    } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
    }
}

module.exports = { verificarTokenAdmin };
