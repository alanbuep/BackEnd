import { cartsDao } from "../dao/index.dao.js";
import { productsDao } from "../dao/index.dao.js";
import { ticketDao } from "../dao/index.dao.js";
import { calculateCartTotal } from "./carts.controller.js";

async function finalizePurchase(req, res, next) {
    try {
        const { cid } = req.params;
        const cart = await cartsDao.getCartById(cid)
        const user = req.session.user;
        console.log(cid)
        console.log(user)

        const paymentStatus = req.query.status;
        if (paymentStatus !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "El pago no fue aprobado"
            });
        }

        const total = calculateCartTotal(cart);

        const result = await ticketDao.createTicket(cart, user, total);

        // enviar mail con ticket

        for (const cartProduct of cart.products) {
            const product = cartProduct.product;
            product.stock -= cartProduct.quantity;
            await productsDao.updateProduct(product._id, { stock: product.stock });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al finalizar la compra",
            error: error.message
        });
    }
}

export { finalizePurchase };