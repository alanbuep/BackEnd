import { productsDao } from "../dao/index.dao.js";

async function getProducts(req, res) {
    const products = await productsDao.getProducts();
    res.send(products);
}

async function getProductsByID(req, res) {
    const { id } = req.params;
    const products = await productsDao.getProductsByID(id);
    res.send(products);
}

async function saveProduct(req, res) {
    const product = req.body;
    const productSave = await productsDao.saveProduct(product);
    res.send(productSave);
}

async function updateProduct(req, res) {
    const { pid } = req.params;
    const { productToUpdated } = req.body;
        const productUpdated = await productsDao.updateProduct(pid, productToUpdated);
        res.send(productUpdated);
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    const productsDeleted = await productsDao.deleteProduct(id);
    res.send(productsDeleted);
}

export { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct };