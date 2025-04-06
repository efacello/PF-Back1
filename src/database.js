import mongoose from "mongoose";

mongoose.connect("mongodb+srv://efacello:back1@cluster0.n9fj9.mongodb.net/Lucerna?retryWrites=true&w=majority")
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch((error) => console.error("Error al conectar con MongoDB:", error));