const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = new express.Router();

router.post("/users", (req, res) => {
  const {email, password} = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({error: err});
    }

    const user = {email, password: hash};

    db.query("INSERT INTO users SET ?", user, (err, result) => {
      if (err) {
        return res.status(500).json({error: err});
      }

      const token = jwt.sign({email}, "clave_secreta");
      return res.status(201).json({token});
    });
  });
});

router.post("/login", (req, res) => {
  const {email, password} = req.body;

  db.query("SELECT * FROM users WHERE email = ?", email, (err, results) => {
    if (err) {
      return res.status(500).json({error: err});
    }

    if (results.length === 0) {
      return res.status(401).json({
        error: "Correo electrónico o contraseña incorrecta",
      });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({error: err});
      }
      if (!isMatch) {
        return res.status(401).json({
          error: "Correo electrónico o contraseña incorrecta",
        });
      }

      const token = jwt.sign({email}, process.env.SECRET_KEY);
      return res.status(200).json({token});
    });
  });
});

module.exports = router;
