import { Router } from "express";
import { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct } from "../controller/products.controller.js";
import { generateProducts } from "../controller/mocking.controller.js";
import authSave from "../middlewares/authAdmin.js";

const router = Router();

router.get("/", getProducts);

router.get("/mockingproducts", generateProducts);

router.get("/:pid", getProductsByID);

router.post("/", saveProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;