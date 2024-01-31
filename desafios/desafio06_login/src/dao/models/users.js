import mongoose from "mongoose";

const userCollection = "users";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, require: true, max: 100 },
    last_name: { type: String, require: true, max: 100 },
    email: { type: String, require: true, max: 100 },
    password: { type: String, require: true, max: 100 },
    birth: { type: Date, require: true },
    role: { type: String, require: true, max: 100 },
});

const UserModel = mongoose.model(userCollection, UserSchema);

export default UserModel;