import CartRepository from "../repositories/cartRepository.js";
import CartDTO from "../dto/cart.dto.js";

class CartService {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    async createCart() {
        const newCart = await this.cartRepository.createCart();
        return new CartDTO(newCart);
    }

    async getCartById(cartId) {
        const cart = await this.cartRepository.getCartById(cartId);
        return cart ? new CartDTO(cart) : null;
    }

    async updateCart(cartId, products) {
        const updatedCart = await this.cartRepository.updateCart(cartId, products);
        return updatedCart ? new CartDTO(updatedCart) : null;
    }

    async deleteCart(cartId) {
        return await this.cartRepository.deleteCart(cartId);
    }
}

export default CartService;