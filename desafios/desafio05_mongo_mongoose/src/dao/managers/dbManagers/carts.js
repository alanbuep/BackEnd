import { CartsModel } from "../../models/carts.js";
import Products from "./products.js";

const productDB = new Products();

export default class Carts {
    constructor() {
        console.log("Working with mongoDB")
    }
    async getAllCarts() {
        let carts = await CartsModel.find().lean();
        return carts;
    }

    async getCartById(id) {
        let cart = await CartsModel.findById(id);
        return cart;
    }

    async addCart() {
        const newCart = {
            timestamp: Date.now(),
            products: [],
        }
        let addCart = new CartsModel(newCart);
        
        let result = await addCart.save();
        return result;
    }

    async addProductToCart(id, product) {
        let cart = await CartsModel.findById(id);
        let productToAdd = await productDB.getProductById(product);
        const { products } = cart;
        const index = products.findIndex(
            (product) => product.product._id.toString() === productToAdd._id.toString()
        );

        if (index !== -1) {
            products[index].quantity++;
        } else {
            products.push({
                product: productToAdd,
                quantity: 1,
            });
        }
        cart.products = products;

        const result = await CartsModel.updateOne({ _id: id }, cart);
        return result;
    }

    async updateCart(id, cart) {
        const result = await CartsModel.updateOne({ _id: id }, cart);
        return result;
    }

    async deleteCart(id) {
        const result = await CartsModel.findByIdAndDelete(id);
        return result;
    }
}