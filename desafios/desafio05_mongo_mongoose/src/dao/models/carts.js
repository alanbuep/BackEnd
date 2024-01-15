import mongoose from "mongoose";

const cartsCollection = "carts";

const CartsSchema = mongoose.Schema({
    timestamp: { type: Date, require: true },
    products: { type: Array, require: true },
})

export const CartsModel = mongoose.model(cartsCollection, CartsSchema);