import express from "express";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { ProductManager } from "./dao/managers/fsManagers/ProductManager.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Products from "./dao/managers/dbManagers/products.js";
import Message from "./dao/managers/dbManagers/messages.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const DB_URL = process.env.DB_URL; /* || "mongodb://localhost:27017/ecommerce" */

const productManager = new ProductManager("../productsList.json");
const productsDB = new Products();
const chatDB = new Message();

let visitas = 0;
let messages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

app.get("/messages", (req, res) => {
    res.json(messages);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running in port:${PORT}`);
});

// Conexion con base de datos
mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Base de datos conectada")
    })
    .then( async () => {
        const result = await chatDB.getAllMesseges();
        messages = result;
    })
    .catch((error) => {
        console.log("Error en la conexión con la base de datos", error)
    });

// Conexion websocket
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("nuevo cliente conectado");
    socket.on("addProduct", async (product) => {
        const title = product.title;
        const description = product.description;
        const code = product.code;
        const price = product.price;
        const status = product.status;
        const stock = product.stock;
        const category = product.category;
        const thumbnail = product.thumbnail;
        try {
            let productToSave = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
            };
            const result = await productsDB.saveProduct(productToSave);
            const allProducts = await productsDB.getAllProducts();
            // console.log(allProducts);
            result && io.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("deleteProduct", async (id) => {
        console.log(id);
        try {
            const result = await productsDB.deleteProduct(id);
            const allProducts = await productsDB.getAllProducts();
            console.log(allProducts);
            result && io.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("new-user", async (data) => {
        console.log("nuevo cliente conectado", data.user);
        socket.user = data.user;
        socket.id = data.id;
        visitas++;
        socket.broadcast.emit("new-user-connected", {
            message: `Se ha conectado un nuevo usuario: ${visitas}`,
            user: data.user,
        });
        io.emit("messageLogs", messages);
    });

    socket.on("message", async (data) => {
        let newMessage = { ...data, timestamp: new Date() }
        messages.push({ ...data, id: socket.id, date: new Date().toISOString() });
        io.emit("messageLogs", messages);
        try {
            const result = await chatDB.saveMessage(newMessage);
        } catch (err) {
            console.log(err);
        }
    });
});