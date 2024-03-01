import ProductDaoFs from "./managers/fsManagers/Product.js";
import ProductsDaoDb from "./managers/dbManagers/products.js";
import CartsDaoFs from "./managers/fsManagers/Cart.js";
import CartsDaoDb from "./managers/dbManagers/carts.js";
import { PERSISTENCE } from "../config/config.js";

export const productsDao = PERSISTENCE === "MONGO" ? new ProductsDaoDb() : new ProductDaoFs();

export const cartsDao = PERSISTENCE === "MONGO" ? new CartsDaoDb() : new CartsDaoFs();