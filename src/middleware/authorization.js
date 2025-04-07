import jwt from "jsonwebtoken";

const authorization = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (!token) {
        return res.status(403).json({ error: "Acceso denegado. No se proporcionó token." });
    }

    jwt.verify(token, "coderhouse", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido." });
        }

        // Verificar si el token contiene la información esperada
        if (!decoded || !decoded.user || !decoded.user.role) {
            return res.status(403).json({ error: "Acceso denegado. Estructura de token incorrecta." });
        }

        const userRole = decoded.user.role; 

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: "Acceso denegado. No tienes permiso." });
        }

        req.user = decoded.user; // Guarda los datos del usuario en req.user
        next();
    });
};

export default authorization;
