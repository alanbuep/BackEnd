import { TicketModel } from "../../models/ticket.js";
import { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct } from "../../../controller/products.controller.js"
import { getCarts, getCartById, addCart, addProductToCart, updateCart, updateProductQuantity, deleteCart, deleteProductCart, calculateCartTotal } from "../../../controller/carts.controller.js"

export default class TicketDao {
    constructor() {
    }

    async createTicket(req, res) {
        const user = req.session.user;
        console.log(user);
        try {
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            console.log("El usuario es: " + user);
            let cart = await getCartById(req, res);
            console.log("El carrito es:" + cart);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            for (const cartProduct of cart.products) {
                console.log(cart.products)
                const product = await getProductsByID(cartProduct.product._id);
                if (!product) {
                    throw new Error(`Producto no encontrado: ${cartProduct.product}`);
                }
                if (product.stock < cartProduct.quantity) {
                    throw new Error(`Stock insuficiente para el producto: ${product.title}`);
                }

                product.stock -= cartProduct.quantity;
                await updateProduct(product._id, product);
            }
            const newTicket = {
                code: String(new Date) + user,
                purchase_datetime: new Date(),
                amount: calculateCartTotal(cart._id),
                purchaser: user
            };

            return newTicket;
        } catch (error) {
            throw new Error("Error al crear el ticket");
        }
    }

    async getAllTickets() {
        try {
            const tickets = await TicketModel.find().lean();
            if (!tickets) {
                throw new Error("Ticket no encontrado");
            }
            return tickets;
        } catch (error) {
            throw new Error("Error al obtener el ticket");
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await TicketModel.findById(ticketId);
            if (!ticket) {
                throw new Error("Ticket no encontrado");
            }
            return ticket;
        } catch (error) {
            throw new Error("Error al obtener el ticket");
        }
    }
}