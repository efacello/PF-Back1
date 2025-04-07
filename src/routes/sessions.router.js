import express from 'express';
import passport from 'passport';
import userController from '../controllers/userController.js';

const router = express.Router();

// Ruta de login
router.post('/login', userController.login);

// Ruta de registro
router.post('/register', userController.register);

router.get('/logout', (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect('/login');
});

// Ruta para obtener los datos del usuario actual
router.get("/current", passport.authenticate("current", { session: false }), userController.getCurrentUser);

export default router;
