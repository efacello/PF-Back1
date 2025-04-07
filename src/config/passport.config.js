import passport from "passport";
import jwt from "passport-jwt";
import User from "../models/user.model.js";  


// Definimos la estrategia de JWT usando el módulo passport-jwt
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

// Función para extraer el token de las cookies
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];  
    }
    return token;
};

// Estrategia Passport para JWT
const initializePassport = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
    }, async (jwt_payload, done) => {
        try {

            // Verifica si el payload tiene la estructura esperada
            if (!jwt_payload.user || !jwt_payload.user.id) {
                return done(null, false, { message: "Token inválido" });
            }

            // Buscar el usuario con el ID correcto
            const user = await User.findById(jwt_payload.user.id);

            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" });
            }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
};


export default initializePassport;