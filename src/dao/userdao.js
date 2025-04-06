import user from "../models/user.model.js"

class UserDAO {
    async findByEmail(email) {
        return await user.findOne({ email });
    }

    async createUser(userData) {
        const newUser = new user(userData);
        return await newUser.save();
    }
}

export default new UserDAO();