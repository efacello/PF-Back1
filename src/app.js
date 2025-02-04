import express from "express";
import exphbs from "express-handlebars";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import "./database.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Handlebars
const hbs = exphbs.create({
    helpers: {
        // Helper para multiplicar
        multiply: (a, b) => a * b
    }
});
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "./src/views"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
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
