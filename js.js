const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tareaapp',
});

// Conecta a MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});

// Configura el middleware Body Parser para manejar solicitudes JSON
app.use(bodyParser.json());

// Configura la carpeta estática para archivos como CSS o JavaScript
app.use(express.static('public'));

// Configura una ruta para obtener la lista de tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) {
      console.error('Error al obtener tareas de la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(results);
    }
  });
});

// Configura una ruta para agregar una tarea
app.post('/agregar-tarea', (req, res) => {
  const taskText = req.body.taskText;
  if (!taskText || taskText.trim() === '') {
    return res.status(400).json({ error: 'La descripción de la tarea es requerida' });
  }

  db.query('INSERT INTO tareas (descripcion) VALUES (?)', [taskText], (err, result) => {
    if (err) {
      console.error('Error al insertar tarea en la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Tarea agregada correctamente' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
