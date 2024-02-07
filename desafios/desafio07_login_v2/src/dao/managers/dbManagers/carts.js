import { CartsModel } from "../../models/carts.js";
import Products from "./products.js";

const productDB = new Products();

export default class Carts {
    constructor() {
        console.log("Working with mongoDB")
    }

    async getAllCarts() {
        let carts = await CartsModel.find().populate('products.product').lean();
        return carts;
    }

    async getCartById(id) {
        let cart = await CartsModel.findById(id).populate('products').lean();
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
            (product) => product.product.toString() === productToAdd._id.toString()
        );

        if (index !== -1) {
            products[index].quantity++;
        } else {
            products.push({
                product: productToAdd._id,
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

    async deleteProductCart(id, productId) {
        let cart = await CartsModel.findById(id).populate('products');
        const { products } = cart;
        const index = products.findIndex(
            (product) => product.product._id.toString() === productId
        );
        console.log(index);
        if (index !== -1) {
            products.splice(index, 1);
            cart.products = products;
            const result = await CartsModel.updateOne({ _id: id }, cart);
            return result;
        } else {
            console.log('Producto no encontrado en el carrito');
            throw new Error('Producto no encontrado en el carrito');
        }
    }

    async updateCart(id, products) {
        let cart = await CartsModel.findById(id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const newProducts = [];
        for (let product of products) {
            const productToAdd = await productDB.getProductById(product.product);
            if (!productToAdd) {
                throw new Error(`Producto con id ${product.product} no encontrado`);
            }
            newProducts.push({
                product: productToAdd._id,
                quantity: product.quantity,
            });
        }
        cart.products = newProducts;
        await cart.save();
        return cart;
    }
    

    async updateProductQuantity(id, productId, quantity) {
        const cart = await CartsModel.findById(id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        return cart;
    }

}