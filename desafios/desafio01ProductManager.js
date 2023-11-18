/*
Consigna
    - Realizar una clase “ProductManager” que gestione un conjunto de productos.
    - Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
    - Cada producto que gestione debe contar con las propiedades:
        + title (nombre del producto)
        + description (descripción del producto)
        + price (precio)
        + thumbnail (ruta de imagen)
        + code (código identificador)
        + stock (número de piezas disponibles)
    - Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
        Validar que no se repita el campo “code” y que todos los campos sean obligatorios.
        Al agregarlo, debe crearse con un id autoincrementable.
    - Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento.
    - Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id.
        En caso de no coincidir ningún id, mostrar en consola un error “Not found”.
*/

class ProductManager {
    constructor() {
        this.products = [];
        this.id = 1;
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Por favor, debe completar todos los campos");
            return;
        }

        const validateCode = this.products.some(productSome => productSome.code === product.code);
        if (validateCode) {
            console.error("El campo Code ya se encuentra");
            return;
        } else {
            let id = this.id++;
            const newProduct = { id, ...product };
            this.products.push(newProduct);
        }
    }

    getProduct() {
        return console.log(this.products);
    }

    getProductByID(id) {
        const productFound = this.products.find(productFound => productFound.id === id);
        if (productFound) {
            console.log(`El producto encontrado es: ${productFound.title}`);
            return;
        } else {
            console.error("Not Found");
            return;
        }
    }
}

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

const productManager = new ProductManager();
productManager.getProduct();
productManager.addProduct(product1);
productManager.getProduct();
productManager.getProductByID(1);

productManager.addProduct(product1);
productManager.getProduct();
productManager.getProductByID(2);

productManager.addProduct(product2);
productManager.getProduct();
productManager.getProductByID(2);

productManager.addProduct(product3);
productManager.getProduct();
productManager.getProductByID(3);
