import express from "express";
import CartManager from "../managers/cart-manager-db.js";
import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";

const router = express.Router();
const cartManager = new CartManager();

// crear carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// listar productos de xx carrito
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        // Buscar el carrito por su ID
        const cart = await CartModel.findById(cartId)
            .populate("products.product")  // Para obtener detalles completos de los productos
            .exec();

        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Carrito no encontrado",
            });
        }

        // Aquí pasamos el cartId y los productos (aunque por ahora no se muestren)
        res.render("cart", { 
            cartId, 
            productos: cart.products || [] // Pasamos los productos, o un arreglo vacío si no los hay
        });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener el carrito",
        });
    }
});

// agregar productos a distintos carritos
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const cart = await CartModel.findById(cartId);  // Encuentra el carrito
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            // Si el producto ya está en el carrito, solo actualizamos la cantidad
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no está, lo agregamos
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        // Regresar los productos con el populate para que incluya los detalles
        const populatedCart = await CartModel.findById(cartId).populate('products.product');
        res.json(populatedCart.products);  // Regresar los productos con los detalles completos
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// eliminar producto de un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params; // Obtienes los parámetros del carrito (cid) y del producto (pid)
        

        // Buscar el carrito por su ID
        const cart = await CartModel.findById(cid); 

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        // Verificar los productos del carrito para asegurarnos de que el pid está ahí

        // Comparar los productos en el carrito y eliminar el que coincida con el pid
        const initialLength = cart.products.length;
        
        // Filtrar los productos del carrito, eliminando el que tenga el product._id igual al pid
        cart.products = cart.products.filter(product => {
            const productId = product.product._id.toString().trim();  // Aseguramos que el ID sea solo una cadena
            return productId !== pid.trim();  // Eliminamos el producto si coincide con pid
        });

        if (cart.products.length === initialLength) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
        }

        // Guardar los cambios en el carrito
        await cart.save();

        // Responder con el carrito actualizado
        res.json({ status: "success", message: "Producto eliminado del carrito", updatedCart: cart });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// actualizar carrito
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        if (!products) {
            return res.status(400).json({ status: "error", message: "Se requiere una lista de productos" });
        }
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }
        cart.products = products;
        await cart.save();
        res.json({ status: "success", message: "Carrito actualizado", updatedCart: cart });
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});


// actualizar cantidad en carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar que la cantidad sea válida
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ status: "error", message: "La cantidad debe ser mayor a 0" });
        }

        // Buscar el carrito por su ID y hacer un populate para traer los productos completos
        const cart = await CartModel.findById(cid).populate('products.product');  // Populate para traer los productos completos
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        // Buscar el producto en el carrito usando el ObjectId
        const productInCart = cart.products.find(p => p.product._id.toString() === pid);  

        if (!productInCart) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
        }

        // Si el producto existe, actualizar la cantidad
        productInCart.quantity = quantity;
        await cart.save();

        // Responder con el carrito actualizado
        res.json({
            status: "success",
            message: "Cantidad actualizada",
            updatedCart: cart
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});


// vaciar carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: "success", message: "Todos los productos han sido eliminados", updatedCart: cart });
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

export default router;
