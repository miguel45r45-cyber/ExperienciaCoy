const express = require('express'); // manejo y flujo de datos
const cors = require('cors');       // habilita peticiones desde el frontend
const authRoutes = require('./routes/autentificador'); // rutas de login/registro
const paquetesRoutes = require('./routes/Paquetes');   // rutas CRUD de paquetes
const db = require('./dataBase/db'); // conexión con la base de datos

const app = express(); // instancia de express

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir imágenes subidas con multer
app.use('/uploads', express.static('uploads'));

// Rutas principales
app.use('/api/autentificador', authRoutes); // login/registro
app.use('/api/paquetes', paquetesRoutes);   // CRUD de paquetes

// Verificar conexión con la base de datos
db.connect((error) => {
  if (error) {
    console.error('Error de conexión a MySQL:', error);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});

// Arrancar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
