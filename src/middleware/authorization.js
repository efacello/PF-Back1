const authorization = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No estás autorizado" });
        }

        if (roles.length === 0) {
            return next();
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        return next();
    };
};

export default authorization;