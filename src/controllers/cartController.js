import CartService from "../services/cartService.js";

const cartService = new CartService();

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error en createCart:", error);  
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateCart = async (req, res) => {
    try {
        const updatedCart = await cartService.updateCart(req.params.cid, req.body.products);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteCart = async (req, res) => {
    try {
        await cartService.deleteCart(req.params.cid);
        res.json({ message: "Carrito eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};