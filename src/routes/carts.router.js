import { Router } from "express";
import express from "express";
import { createCart, getCartById, updateCart, deleteCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.put("/:cid", updateCart);
router.delete("/:cid", deleteCart);

console.log("Rutas dentro de cartsRouter:");
router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`- ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`);
    }
});

export default router;