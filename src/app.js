// paquete Express.js para crear el servidor
const express = require('express');

// paquete para analizar los datos JSON enviados en las solicitudes
const bodyParser = require('body-parser');

// paquete para conectarse y ejecutar consultas en la base de datos MySQL
const mysql = require('mysql2');

// paquete para cifrar y comparar contraseñas utilizando el algoritmo de hashing bcrypt
const bcrypt = require('bcryptjs');

// paquete para generar y verificar JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// paquete para conectar con un archivo de variables de entorno
require('dotenv').config();


const app = express();

// agregar el middleware para analizar datos JSON en las solicitudes
app.use(bodyParser.json());

// agregar el middleware para analizar datos codificados en la URL en las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));

// crear una conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

// establecer una conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

// ruta para crear un nuevo usuario
app.post('/users', (req, res) => {
  const { email, password } = req.body;

  // cifrar la contraseña utilizando el algoritmo de hashing bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    // crear un nuevo objeto de usuario con la contraseña cifrada
    const user = { email, password: hash };

    // insertar el usuario en la base de datos
    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // crear un JWT con el correo electrónico del usuario y devolverlo al cliente
      const token = jwt.sign({ email }, 'clave_secreta');
      return res.status(201).json({ token });
    });
  });
});

// ruta para manejar el inicio de sesión del usuario
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    // comprobar si el correo electrónico existe en la base de datos
    db.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
        if (err) {
        return res.status(500).json({ error: err });
        }

    // si el correo electrónico no existe, devolver un error
    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo electrónico o contraseña incorrecta' });
    }

    // comprobar si la contraseña es correcta utilizando el algoritmo de hashing bcrypt
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // si la contraseña es incorrecta, devolver un error
      if (!isMatch) {
        return res.status(401).json({ error: 'Correo electrónico o contraseña incorrecta' });
      }

      // utilizar el paquete jsonwebtoken para crear un token JWT y devolverlo al cliente, utiliza clave secreta configura en las variables de entorno
      const token = jwt.sign({ email }, process.env.SECRET_KEY);
      return res.status(200).json({ token });
    });
  });
});

// iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});