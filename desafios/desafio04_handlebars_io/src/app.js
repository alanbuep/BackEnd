import express from "express";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { ProductManager } from "./classes/ProductManager.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager("../productsList.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
    console.log(`Server is running in port:${PORT}`);
});

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
            const result = await productManager.addProduct(
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
            );
            const allProducts = await productManager.getProducts();
            // console.log(allProducts);
            result && io.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("deleteProduct", async (id) => {
        console.log(id);
        try {
            const result = await productManager.deleteProduct(id);
            const allProducts = await productManager.getProducts();
            console.log(allProducts);
            result && io.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });
});