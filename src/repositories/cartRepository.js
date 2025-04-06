import CartDAO from "../dao/cartDao.js";

class CartRepository {
    constructor() {
        this.cartDAO = new CartDAO();
    }

    async createCart() {
        return await this.cartDAO.createCart();
    }

    async getCartById(cartId) {
        return await this.cartDAO.getCartById(cartId);
    }

    async updateCart(cartId, products) {
        return await this.cartDAO.updateCart(cartId, { products });
    }

    async deleteCart(cartId) {
        return await this.cartDAO.deleteCart(cartId);
    }
}

export default CartRepository;