import mongoose from "mongoose";

const ticketCollection = "ticket";

const ticketSchema = mongoose.Schema({
    code: { type: String, require: true },
    purchase_datetime: { type: Date, require: true },
    amount: { type: Number, require: true },
    purchaser: { type: String, require: true }
})

export const TicketModel = mongoose.model(ticketCollection, ticketSchema);