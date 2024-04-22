import { cartsDao } from "../dao/index.dao.js";
import { getProductsByID } from "./products.controller.js";

async function getCarts(req, res) {
    try {
        const carts = await cartsDao.getCarts();
        res.json({ data: carts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

async function getCartById(req, res) {
    try {
        console.log(req)
        const { cid } = req.params;
        console.log(cid)
        const cart = await cartsDao.getCartById(cid);
        console.log(cart);
        if (cart) {
            res.json({ data: cart });
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

async function addCart(req, res) {
    try {
        const newCart = await cartsDao.addCart();
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
}

async function addProductToCart(req, res) {
    const { cid, pid } = req.params;
    try {
        const productAddCart = await cartsDao.addProductToCart(cid, pid);
        res.status(200).json({
            message: "Producto agregado al carrito con éxito",
            data: productAddCart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al agregar el producto al carrito",
            data: error
        });
    }
}

async function updateCart(req, res) {
    try {
        const { cid } = req.params;
        const products = req.body;
        console.log(cid)
        console.log(products)
        const updatedCart = await cartsDao.updateCart(cid, products);
        res.status(200).json({
            message: "Carrito actualizado con éxito",
            data: updatedCart
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error al actualizar el carrito",
            data: error
        });
    }
}

async function updateProductQuantity(req, res) {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
    console.log(quantity)
    try {
        const updatedCart = await cartsDao.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({
            message: "Cantidad de producto actualizada con éxito",
            data: updatedCart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la cantidad del producto",
            data: error
        });
    }
}

async function deleteCart(req, res) {
    const { cid } = req.params;
    try {
        let cart = await cartsDao.getCartById(cid);
        if (cart) {
            const cartDeleted = await cartsDao.deleteCart(cid);
            res.status(200).json({
                message: "Carrito eliminado con éxito",
                data: cartDeleted
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
}

async function deleteProductCart(req, res) {
    const { cid, pid } = req.params;
    try {
        let cart = await getCartById(cid);
        if (cart) {
            const productDeleted = await cartsDao.deleteProductCart(cid, pid);
            res.status(200).json({
                message: "Producto del carrito eliminado con éxito",
                data: productDeleted
            });
        } else {
            res.status(404).json({
                message: "El Carrito o producto solicitado no existe",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

async function calculateCartTotal(cartId) {
    try {
        const cart = await getCartById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        let total = 0;
        for (const cartProduct of cart.products) {
            const product = await getProductsByID(cartProduct.product._id);
            if (!product) {
                throw new Error(`Producto no encontrado: ${cartProduct.product}`);
            }
            total += product.price * cartProduct.quantity;
        }
        return total;
    } catch (error) {
        throw new Error("Error al calcular el total del carrito");
    }
}

export { getCarts, getCartById, addCart, addProductToCart, updateCart, updateProductQuantity, deleteCart, deleteProductCart, calculateCartTotal }