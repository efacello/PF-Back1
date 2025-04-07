import express from "express";
import ProductManager from "../managers/product-manager-db.js";
import CartManager from "../managers/cart-manager-db.js";
import authorization from "../middleware/authorization.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
  res.send("¡Bienvenidos a Lucerna!");
});

// 🔹 Solo los usuarios pueden ver la vista de productos
router.get("/products", authorization(["user"]), async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const productos = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const nuevoArray = productos.docs.map((producto) => {
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
      totalPages: productos.totalPages,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// 🔹 Solo los usuarios pueden ver el detalle de un producto
router.get("/products/:pid", authorization(["user"]), async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.render("prod.detail", { product });
  } catch (error) {
    console.error("Error al obtener el producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🔹 Solo los usuarios pueden ver su carrito
router.get("/carts/:cid", authorization(["user"]), async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productsInCart = cart.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));

    res.render("carts", { productos: productsInCart });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🔹 Rutas de autenticación
router.get("/register", (req, res) => {
  res.render("register"); 
});

router.get("/login", (req, res) => {
  res.render("login"); 
});

// 🔹 Solo los administradores pueden ver la vista realtimeproducts
router.get("/realtimeproducts", authorization(["admin"]), (req, res) => {
  res.render("realtimeproducts", { username: req.user.username });
});

export default router;
