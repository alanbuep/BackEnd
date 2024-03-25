import { productsDao } from "../dao/index.dao.js";
import CustomError from "../services/customError.js";
import enumErrors from "../services/enumError.js";
import { generateAddProductErrorInfo } from "../services/infoError.js";

async function getProducts(req, res) {
    const { limit } = req.query;
    try {
        const products = await productsDao.getProducts();
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
}

async function getProductsByID(req, res) {
    const { pid } = req.params;
    console.log(req.params)
    console.log(pid)
    try {
        const product = await productsDao.getProductByID(pid);
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
};

async function saveProduct(req, res, next) {
    try {
        const product = req.body;
        console.log(product);
        if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
            CustomError.createError({
                name: "Error al crear el producto",
                cause: generateAddProductErrorInfo(req.body),
                message: "Uno o más campos son inválidos",
                code: enumErrors.ADD_PRODUCT_ERROR,
            });
        }
        const productSaved = await productsDao.saveProduct(product);
        res.status(200).json({ message: "Producto cargado con éxito", data: productSaved });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
};

async function updateProduct(req, res) {
    const { pid } = req.params;
    const { productToUpdated } = req.body;
    try {
        const productFind = await getProductsByID(pid)
        if (productFind) {
            const productUpdated = await productsDao.updateProduct(pid, productToUpdated);
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
}

async function deleteProduct(req, res) {
    const { pid } = req.params;
    try {
        let product = await getProductsByID(pid);
        if (product) {
            const respuesta = await deleteProduct(pid);
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
}

export { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct };