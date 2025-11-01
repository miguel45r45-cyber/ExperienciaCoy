const express = require('express');//importamos exprees para el manejo y flujo de datos
const cors = require('cors');// importamos cors para poder hacer peticiones desde el frontend
const authRoutes = require('./routes/autentificador'); //establecemos coneccion con router ara aceder a los indentificadores
const db = require('./dataBase/db');// establecemos coneccion con la db

const app = express();//creamos una instacia con expres para poder manipular las rutas

app.use(cors());//activamos el cors
app.use(express.json());//permitimos que el server procese los paquetes json para tener manipulacion de los archivos
app.use('/api/autentificador', authRoutes); // activa tus rutas de login/registro


db.connect((error) => {//evaluamos si la coneccion con la base de datos sigue activa
  if (error) {
    console.error('Error de conexión a MySQL:', error);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});

app.listen(5000, () => {
  console.log('Servidor corriendo en puerto 5000');// verificamos que el servidor corra en el puerto 5000
});
