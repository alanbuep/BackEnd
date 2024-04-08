import { Router } from "express";
import { addCart, addProductToCart, deleteCart, deleteProductCart, getCartById, getCarts, updateCart, updateProductQuantity } from "../controller/carts.controller.js";
import authTicket from "../middlewares/authTicket.js";
import { finalizePurchase } from "../controller/purchase.controller.js"

const router = Router();

router.get("/", getCarts);

router.get("/:cid", getCartById);

router.post("/", addCart);

router.post("/:cid/products/:pid", addProductToCart);

router.delete("/:cid", deleteCart);

router.delete("/:cid/products/:pid", deleteProductCart);

router.put("/:cid", updateCart);

router.put("/:cid/products/:pid", updateProductQuantity);

router.get("/:cid/purchase", authTicket, finalizePurchase);

export default router;