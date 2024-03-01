import { cartsDao } from "../dao/index.dao.js";

async function getCarts(req, res) {
    const carts = await cartsDao.getCarts();
    res.send(carts);
}

async function getCartById(req, res) {
    const { id } = req.params;
    const cart = await cartsDao.getCartById(id);
    res.send(cart);
}

async function addCart(req, res) {
    const cart = await cartsDao.addCart();
    res.send(cart);
}

async function addProductToCart(req, res) {
    const { cid, pid } = req.params;
    const cart = await cartsDao.addProductToCart(cart_id, product_id);
    res.send(cart);
}

