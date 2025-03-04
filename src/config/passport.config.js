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
            // Buscar el usuario en la base de datos usando el id que viene en el JWT
            const user = await User.findById(jwt_payload.id); 
            if (!user) {
                return done(null, false);  
            }
            // Si el usuario existe, lo pasamos al siguiente middleware
            return done(null, user);  
        } catch (error) {
            return done(error, false);  // En caso de error, pasamos el error
        }
    }));
}

export default initializePassport;