/* 
    Consigna:
        -Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).

    Aspectos a incluir:
        -La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.

    Debe guardar objetos con el siguiente formato:
        -id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
        -title (nombre del producto)
        -description (descripción del producto)
        -price (precio)
        -thumbnail (ruta de imagen)
        -code (código identificador)
        -stock (número de piezas disponibles)

    Aspectos a incluir:
        -Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
        -Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
        -Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
        -Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
        -Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
*/

const fs = require('fs');
const path = require('path');
const PRODUCT_FILE = './productFile.json'

class ProductManager {
    constructor(path) {
        this.id = 1;
        this.path = path;
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
                let products = fs.readFileSync(this.path, 'utf-8');
                return JSON.parse(products);
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
                return;
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

// Test

const product1 = {
    title: "Acer 21.5 inch monitor",
    description: "Full HD IPS",
    price: 200000,
    thumbnail: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    code: "acer21.5",
    stock: 10
}

const product2 = {
    title: "Acer 21.5 inch monitor",
    description: "Full HD IPS",
    price: 200000,
    thumbnail: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    code: "acer21.5",
    stock: 10
}

const product3 = {
    title: "Asus 21.5 inch monitor",
    description: "Full HD IPS",
    price: 200000,
    thumbnail: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    code: "Asus21.5",
    stock: 10
}

async function test() {
    const productManager = new ProductManager(PRODUCT_FILE);

    await productManager.addProduct(product1);
    await productManager.addProduct(product2);
    await productManager.addProduct(product3);

    const allProducts = await productManager.getProduct();
    console.log('Todos los productos:', allProducts);

    const idProduct = await productManager.getProductByID(2);
    console.log('Producto por ID:', idProduct);

    await productManager.deleteProduct(2);
    const allProducts2 = await productManager.getProduct();
    console.log('Producto borrado, nueva lista:', allProducts2);

    console.log('Editar producto');
    await productManager.updateProduct(1, product3);
    const allProducts3 = await productManager.getProduct();
    console.log('Nueva lista editada:', allProducts3);

    console.log('Editar campo');
    await productManager.updateProduct(1, product1);
    const allProducts4 = await productManager.getProduct();
    console.log('Nueva lista editada:', allProducts4);
}

test();