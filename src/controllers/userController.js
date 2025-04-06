import UserService from "../services/userService.js";
import UserDTO from "../dto/user.dto.js";

class UserController {
    async login(req, res) {
        const { email, password } = req.body;
        try {
        const { token, user } = await UserService.loginUser(email, password);
        res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
        res.redirect("/api/sessions/current");
        } catch (error) {
        res.status(400).json({ message: error.message });
        }
    }

    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
        const newUser = await UserService.registerUser({ first_name, last_name, email, password, age, role: 'user' });
        res.redirect('/login');
        } catch (error) {
        res.status(400).json({ message: error.message });
        }
    }

    async getCurrentUser(req, res) {
        if (req.user) {
        const userDTO = new UserDTO(req.user);
        res.render('profile', { user: userDTO });
        } else {
        res.status(401).json({ message: "No estás autorizado" });
        }
    }
}

export default new UserController();