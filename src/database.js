import mongoose from "mongoose";

mongoose.connect("mongodb+srv://efacello:back1@cluster0.n9fj9.mongodb.net/Lucerna")
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log("Vamos a morir, tenemos un error:", error));
