import { Router } from "express";
import { ProductManager } from "../classes/ProductManager.js";

const router = Router();
const productManager = new ProductManager("../productsList.json");

router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        let products = await productManager.getProducts();
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
        let product = await productManager.getProductByID(pid);
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
    try {
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
        res.status(200).json({ message: "Producto cargado con éxito", data: result });
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
        if (product) {
            let newProduct = {
                title: title || product.title,
                description: description || product.description,
                code: code || product.code,
                price: price || product.price,
                status: status || product.status,
                stock: stock || product.stock,
                category: category || product.category,
                thumbnail: thumbnail || product.thumbnail,
            };
            const respuesta = await productManager.updateProduct(pid, newProduct);
            res.status(200).json({
                message: "Producto actualizado con éxito",
                data: respuesta
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
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

export default router;