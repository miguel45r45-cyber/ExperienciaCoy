const mysql = require("mysql2");// importador de mysql2 para manipular la db

const connection = mysql.createConnection({// creamos una constante para establecer la coneccion con una instancia
    host: 'localhost',// establecemos que se encuentra en el servidor
    database: 'agencia_viajes',// nombre de la base de dato, usuario con la que se creo y clave para acceder
    user: 'root',
    password: 'MiClaveSegura2025',
});

connection.connect((error) => {//intenta hacer conecion con db
    if (error) {// usamos un if para que en caso de un error muestre si no se estrablece la coneccion
    console.error('Error de conexión:', error);
    throw error;// usamos throw para que nos refleje a que se pudo aber debido el error 
    }
    console.log("Conexión exitosa a la base de datos");
});

module.exports = connection;
