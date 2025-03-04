import bcrypt from "bcrypt"; 

// Función para crear un hash de la contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 

// Función para verificar si la contraseña es válida
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password); 
