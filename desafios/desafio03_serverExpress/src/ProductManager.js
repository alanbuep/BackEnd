import fs from 'fs';
import utils from "./utils.js"
import crypto from "crypto";

class ProductManager {
    constructor(path) {
        this.id = 1;
        this.path = path;
        this.products = [];
    }

    addProduct(product) {
        try {
            let products = this.getProduct();
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                console.error("Por favor, debe completar todos los campos");
                return;
            }

            const validateCode = products.some(productSome => productSome.code === product.code);
            if (validateCode) {
                console.error("El campo Code ya se encuentra");
                return;
            } else {
                let id = this.id++;
                const newProduct = { id, ...product };
                products.push(newProduct);
                fs.writeFileSync(this.path, JSON.stringify(products));
            }
        } catch (error) {
            console.error('Error al agregar el producto', error);
        }
    }

    getProduct() {
        try {
            if (fs.existsSync(this.path)) {
                let productsRead = fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(productsRead);
                return this.products;
            } else {
                console.log('El archivo no existe');
            }
        } catch (error) {
            console.error('Error leyendo el archivo', error);
            return [];
        }
    }

    getProductByID(id) {
        try {
            let products = this.getProduct();
            const productFound = products.find(product => product.id === id);
            if (productFound) {
                console.log(`El producto encontrado es: ${productFound.title}`);
                return productFound;
            } else {
                console.error("Not Found");
                return;
            }
        } catch (error) {
            console.error('Error buscando el producto', error);
        }
    }

    updateProduct(id, updatedProduct, updateCampo, datoCampo) {
        try {
            let products = this.getProduct();
            let index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                if (updateCampo && datoCampo) {
                    products[index][updateCampo] = datoCampo;
                    fs.writeFileSync(this.path, JSON.stringify(products));
                } else {
                    if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.price || !updatedProduct.thumbnail || !updatedProduct.code || !updatedProduct.stock) {
                        console.error("Por favor, debe completar todos los campos");
                        return;
                    } else {
                        updatedProduct.id = id;
                        products[index] = updatedProduct;
                        fs.writeFileSync(this.path, JSON.stringify(products));
                    }
                }
            } else {
                console.error("El producto no fue encontrado");
            }
        } catch (error) {
            console.error('Error actualizando el producto', error);
        }
    }

    deleteProduct(id) {
        try {
            let products = this.getProduct();
            let newProducts = products.filter(product => product.id !== id);
            fs.writeFileSync(this.path, JSON.stringify(newProducts));
        } catch (error) {
            console.error('Error al eliminar el producto', error);
        }
    }
}

export default ProductManager;