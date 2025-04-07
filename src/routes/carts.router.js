import { Router } from "express";
import express from "express";
import { createCart, getCartById, updateCart, deleteCart } from "../controllers/cartController.js";
import authorization from "../middleware/authorization.js";

const router = express.Router();
router.use (authorization);

router.post("/", createCart);
router.get("/:cid", getCartById);
router.put("/:cid", updateCart);
router.delete("/:cid", deleteCart);


export default router;