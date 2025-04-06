import express from "express";
import exphbs from "express-handlebars";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import "./database.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import cookieParser from "cookie-parser"; 
import passport from "passport";  
import initializePassport from "./config/passport.config.js";  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PUERTO = 8080;

// Inicializamos Passport
initializePassport();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());  // Usamos cookie-parser para poder acceder a las cookies
app.use(passport.initialize());  // Inicializamos Passport para que use las estrategias
initializePassport();


// Handlebars
const hbs = exphbs.create({
    helpers: {
        multiply: (a, b) => a * b
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "./src/views"));

// Rutas
app.use("/api/products", productsRouter);
app.use ("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter); 
app.use("/", viewsRouter);

// Página 404 si no se encuentra la ruta
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});


app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
