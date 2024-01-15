import { Router } from "express";
import { ProductManager } from "../dao/managers/fsManagers/ProductManager.js";
import Products from "../dao/managers/dbManagers/products.js";

const router = Router();
const productManager = new ProductManager("../productsList.json");
const productsDB = new Products();

router.get("/products", async (req, res) => {
    const products = await productsDB.getAllProducts() || productManager.getProducts();
    res.render("products", {
        title: "Listado de productos",
        products: products,
        style: "css/styles.css",
    });
});

router.get("/realtime", async (req, res) => {
    const products = await productsDB.getAllProducts() || productManager.getProducts();
    res.render("realtime", {
        title: "Productos en tiempo real",
        products: products,
        style: "css/styles.css",
        scriptName: "realtime.js",
    });
});

router.get("/chat", async (req, res) => {
    res.render("chat", {
        title: "Chat",
        style: "css/styles.css",
        scriptName: "chat.js",
    });
});

export default router;