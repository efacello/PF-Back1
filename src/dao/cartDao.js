import CartModel from "../models/cart.model.js";

class CartDAO {
    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate("products.product").exec();
    }

    async updateCart(cartId, updateData) {
        return await CartModel.findByIdAndUpdate(cartId, updateData, { new: true });
    }

    async deleteCart(cartId) {
        return await CartModel.findByIdAndDelete(cartId);
    }
}

export default CartDAO;