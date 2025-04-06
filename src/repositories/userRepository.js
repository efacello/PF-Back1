import UserDAO from "../dao/userdao.js";

class UserRepository {
    async getUserByEmail(email) {
        return await UserDAO.findByEmail(email);
    }

    async createUser(userData) {
        return await UserDAO.createUser(userData);
    }
}

export default new UserRepository();