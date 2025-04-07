import UserRepository from "../repositories/userRepository.js";
import UserDTO from "../dto/user.dto.js";
import { createHash, isValidPassword } from "../utils/util.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "coderhouse";

class UserService {
    async loginUser(email, password) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user) throw new Error("Usuario no encontrado");

        if (!isValidPassword(password, user)) throw new Error("Contraseña incorrecta");

        const token = jwt.sign(
            { user: { id: user._id, role: user.role, email: user.email } }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );
    
        return { token, user: new UserDTO(user) };
    }

    async registerUser(userData) {
        const existingUser = await UserRepository.getUserByEmail(userData.email);
        if (existingUser) throw new Error("Usuario ya registrado");

        userData.password = createHash(userData.password);
        const newUser = await UserRepository.createUser(userData);

        return new UserDTO(newUser);
    }
}

export default new UserService();