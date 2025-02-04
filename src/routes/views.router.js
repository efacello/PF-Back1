import express from "express";
import ProductManager from "../managers/product-manager-db.js";
import CartManager from "../managers/cart-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
   res.send("¡Bienvenidos a Lucerna!");
});

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit),
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      res.render("products", {
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/products/:pid", async (req, res) => {
   const { pid } = req.params;
 
   try {
     const product = await productManager.getProductById(pid); // Obtener el producto por su ID
 
     if (!product) {
       return res.status(404).json({ error: "Producto no encontrado" });
     }
 
     // Renderizar la vista con el producto encontrado
     res.render("prod.detail", { product });
   } catch (error) {
     console.error("Error al obtener el producto", error);
     res.status(500).json({ error: "Error interno del servidor" });
   }
 });

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsInCart = cart.products.map(item => ({
         product: item.product.toObject(),
         //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
         quantity: item.quantity
      }));

      res.render("carts", { productos: productsInCart  });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

export default router;
