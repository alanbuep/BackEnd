import mongoose from "mongoose";

const productsCollection = "products";

const ProductsSchema = mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    price: { type: Number, require: true },
    status: { type: Boolean, require: true },
    stock: { type: Number, require: true },
    thumbnail: { type: String, require: false },
})

export const ProductsModel = mongoose.model(productsCollection, ProductsSchema);