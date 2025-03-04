import express from 'express';
import CartManager from '../managers/cart-manager-db.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/util.js'; 
import passport from 'passport';

const router = express.Router();
const JWT_SECRET = "coderhouse";  // = para la verificación del token
const manager = new CartManager ();

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña usando la función isValidPassword
    const isMatch = isValidPassword(password, user);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar el JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Guardar el token en la cookie
    res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/api/sessions/current");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Ruta de registro
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya registrado" });
    }

    // Encriptar la contraseña con createHash
    const hashedPassword = createHash(password);

    // Crear un nuevo carrito para el usuario
    const newCart = await manager.createCart();

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
      cart: newCart._id, 
      role: 'user',
    });

    await newUser.save();

    res.redirect('/login');

  } catch (error) {
    console.error("Error al registrar el usuario", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

// Ruta de logout
router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");  // Eliminar la cookie del token
  res.redirect("/login");  // Redirige a la página de login
});

// Ruta para obtener los datos del usuario actual
router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
  if (req.user) {
      const user = req.user.toObject();
      res.render('profile', { user: user });  
  } else {
      res.status(401).json({ message: "No estás autorizado" });  
  }
});

// Ruta de admin 
router.get("/admin", passport.authenticate("current", { session: false }), (req, res) => {
  if (req.user.rol !== "admin") {
      return res.status(403).json({ message: "Acceso Denegado" });  
  }

  res.json({ message: "Bienvenido al panel de administración" });  
});


export default router;


