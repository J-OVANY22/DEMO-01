const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // El nombre de usuario de tu base de datos
  password: '', // La contraseña de tu base de datos
  database: 'themonetchbot_db', // El nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Agrega una tarea a la base de datos
app.post('/agregar-tarea', (req, res) => {
  const { taskText, dueDate, currentDate } = req.body;

  if (!taskText || !dueDate || !currentDate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO tareas (texto, fecha_entrega, fecha_creacion) VALUES (?, ?, ?)';
  db.query(query, [taskText, dueDate, currentDate], (err, result) => {
    if (err) {
      console.error('Error al agregar tarea:', err);
      return res.status(500).json({ error: 'Error al agregar tarea' });
    }

    res.status(201).json({ message: 'Tarea agregada con éxito' });
  });
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
