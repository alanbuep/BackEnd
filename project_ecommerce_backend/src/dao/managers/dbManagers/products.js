import { ProductsModel } from "../../models/products.js"

export default class Products {
    constructor() {
        console.log("Working with mongoDB")
    }
    async getAllProducts() {
        let products = await ProductsModel.find().lean();
        return products;
    }

    async getProductById(id) {
        let product = await ProductsModel.findById(id);
        return product;
    }

    async saveProduct(product) {
        let addProduct = new ProductsModel(product);
        let result = await addProduct.save();
        return result;
    }

    async updateProduct(id, product) {
        const result = await ProductsModel.updateOne({ _id: id }, product);
        return result;
    }

    async deleteProduct(id) {
        const result = await ProductsModel.findByIdAndDelete(id);
        return result;
    }
}