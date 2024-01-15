import { Router } from "express";
import { CartManager } from "../dao/managers/fsManagers/CartManager.js";
import Carts from "../dao/managers/dbManagers/carts.js";

const router = Router();
const cartManager = new CartManager("carts.json");
const cartDB = new Carts();

router.get("/", async (req, res) => {
    try {
        // let response = await cartManager.getCarts();
        let response = await cartDB.getAllCarts();
        res.json({ data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        // const cart = await cartManager.getCartById(cid);
        const cart = await cartDB.getCartById(cid);
        if (cart) {
            res.json({ data: cart });
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/", async (req, res) => {
    try {
        // const newCart = await cartManager.addCart();
        const newCart = await cartDB.addCart();
        res.status(201).json({
            message: "Carrito creado con éxito",
            data: newCart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el carrito",
            data: error
        });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        // const updatedCart = await cartManager.addProductToCart(cid, pid);
        const updatedCart = await cartDB.addProductToCart(cid, pid);
        console.log(updatedCart)
        res.status(200).json({
            message: "Producto agregado al carrito con éxito",
            data: updatedCart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al agregar el producto al carrito",
            data: error
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        // let cart = await cartManager.getCartById(pid);
        let cart = await cartDB.getCartById(pid);

        if (cart) {
            // const respuesta = await cartManager.deleteCart(pid);
            const respuesta = await cartDB.deleteCart(pid);
            res.status(200).json({
                message: "Carrito eliminado con éxito",
                data: respuesta
            });
        } else {
            res.status(404).json({
                message: "El Carrito solicitado no existe",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

export default router;