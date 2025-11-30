const express = require('express'); 
const cors = require('cors');       
const auth = require('./routes/autentificador'); 
const paquetes = require('./routes/Paquetes');
const preguntaSeguridad = require('./routes/preguntaSeguridad');   
const reservaciones = require('./routes/reservaciones'); 
const reservacionesAgrupadas = require('./routes/reservacionesAgrupadas'); 
const seguimiento = require('./routes/seguimiento'); 
const reservacionesEstado = require('./routes/reservacionesEstado');
const reservacionesPDF = require('./routes/reservacionesPDF');
const metodoPago = require("./routes/metodoPago");
const db = require('./dataBase/db'); 

const app = express(); 

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir imágenes subidas con multer
app.use('/uploads', express.static('uploads'));

// Rutas principales
app.use('/api/autentificador', auth); 
app.use('/api', preguntaSeguridad);
app.use('/api/paquetes', paquetes);   
app.use('/api/reservaciones', reservaciones); 
app.use('/api/reservaciones-agrupadas', reservacionesAgrupadas); 
app.use('/api/seguimiento', seguimiento);
app.use('/api/reservaciones-estado', reservacionesEstado);
app.use('/api/reservaciones-pdf', reservacionesPDF);
app.use("/api/metodo_pago", metodoPago);

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
