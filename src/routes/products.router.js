import { Router } from "express";
import * as productController from "../controllers/productController.js";
import authorization from "../middleware/authorization.js";

const router = Router();

// 🔹 Cualquier usuario puede obtener la lista de productos o un producto específico
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);

// 🔹 Solo los administradores pueden agregar, modificar y eliminar productos
router.post("/", authorization(["admin"]), productController.addProduct);  
router.put("/:pid", authorization(["admin"]), productController.updateProduct); 
router.delete("/:pid", authorization(["admin"]), productController.deleteProduct); 

export default router;