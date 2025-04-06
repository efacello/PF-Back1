import { Router } from "express";
import * as productController from "../controllers/productController.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", authorization(['admin']), productController.addProduct);  
router.put("/:pid", authorization(['admin']), productController.updateProduct); 
router.delete("/:pid", authorization(['admin']), productController.deleteProduct); 
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

export default router;