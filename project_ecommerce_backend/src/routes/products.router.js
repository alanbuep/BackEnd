import { Router } from "express";
import { ProductManager } from "../dao/managers/fsManagers/ProductManager.js";
import Products from "../dao/managers/dbManagers/products.js";

const router = Router();
const productManager = new ProductManager("../productsList.json");
const productsDB = new Products();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        let products = await productsDB.getAllProducts() || productManager.getProducts();
        if (limit) {
            let productsLimit = products.slice(0, Number(limit));
            res.json({
                data: productsLimit,
                limit: limit,
                quantity: productsLimit.length
            });
        } else {
            res.json({
                data: products,
                limit: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        let product = await productsDB.getProductById(pid) || productManager.getProductByID(pid);
        if (product) {
            res.json({ message: "Success", data: product });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error,
        });
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category,thumbnail } = req.body;
    const productToSave = req.body;
    try {
        const resultDB = await productsDB.saveProduct(productToSave);
        const result = await productManager.addProduct(
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        );
        res.status(200).json({ message: "Producto cargado con éxito", data: result + resultDB });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, status, thumbnail, code, stock, category } = req.body;
    try {
        let product = await productManager.getProductByID(pid);
        let productDB = productsDB.getProductById(pid);

        if (productDB) {
            let newProductDB = {
                title: title || productDB.title,
                description: description || productDB.description,
                code: code || productDB.code,
                price: price || productDB.price,
                status: status || productDB.status,
                stock: stock || productDB.stock,
                category: category || productDB.category,
                thumbnail: thumbnail || productDB.thumbnail,
            };
            const respuestaDB = await productsDB.updateProduct(pid, newProductDB);
            res.status(200).json({
                message: "Producto actualizado con éxito",
                data: respuestaDB
            });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        let product = await productManager.getProductByID(pid);
        let productDB = await productsDB.getProductById(pid);
        if (product) {
            const respuesta = await productManager.deleteProduct(pid);
            res.status(200).json({
                message: "Producto eliminado con éxito",
                data: respuesta
            });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
        if (productDB) {
            const respuestaDB = await productsDB.deleteProduct(pid);
            res.status(200).json({
                message: "Producto eliminado con éxito",
                data: respuestaDB
            });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

export default router;