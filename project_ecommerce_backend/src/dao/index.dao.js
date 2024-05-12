import ProductsDaoDb from "./managers/dbManagers/products.js";
import CartsDaoDb from "./managers/dbManagers/carts.js";
import ProductDaoFs from "./managers/fsManagers/Product.js";
import CartsDaoFs from "./managers/fsManagers/Cart.js";
import TicketDao from "./managers/dbManagers/ticket.js";
import { PERSISTENCE } from "../config/config.js";

export const productsDao = PERSISTENCE === "MONGO" ? new ProductsDaoDb() : new ProductDaoFs();
// export const productsDao =  new ProductsDaoDb();

export const cartsDao = PERSISTENCE === "MONGO" ? new CartsDaoDb() : new CartsDaoFs();

export const ticketDao =  new TicketDao();