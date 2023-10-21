import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './routes/routes.js';

// 1- Inicializamos express
const app = express();

// 2- Configuraciones del servidor
const PORT = process.env.PORT || 5000;

// 3- Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); // <==== Parsear el body como JSON

// 4- Rutas
app.use('/api/v1', router);

// 5- Loop del servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});
