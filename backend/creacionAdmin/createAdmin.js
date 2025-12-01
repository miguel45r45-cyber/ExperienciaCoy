const bcrypt = require('bcryptjs'); //llamamos la biblioteca para encriptar la contraseña
const db = require('../dataBase/db'); // conectamos con la base de datos 

const crearAdmin = async () => {// funcion para crear admin 
    const rif = 'J-501718660';
    const correo = 'experienciacoy@gmail.com';
    const contrasena = '1234';

    try {
    const salt = await bcrypt.genSalt(10);// salt variable que generara valores aleatorios  
    const hashedPassword = await bcrypt.hash(contrasena, salt);// conversion a

    const sql = 'INSERT INTO administrador (rif, correo, contrasena) VALUES (?, ?, ?)';
    db.query(sql, [rif, correo, hashedPassword], (err, result) => {
        if (err) {
        console.error(' Error al insertar admin:', err);
        } else {
        console.log(' Admin insertado correctamente');
        }
        process.exit();
    });
    } catch (error) {
    console.error(' Error al encriptar contraseña:', error);
    process.exit();
    }
};

crearAdmin();
