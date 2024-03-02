import { Router } from "express";
import { ProductsModel } from "../dao/models/products.js";
import { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct } from "../controller/products.controller.js"
import { getCarts, getCartById, addCart, addProductToCart, updateCart, updateProductQuantity, deleteCart, deleteProductCart } from "../controller/carts.controller.js"

const router = Router();

router.get("/products", async (req, res) => {
    try {
        const { limit, page, query, sort } = req.query;
        const isSorted = () => {
            if (sort === "asc") {
                return 1;
            } else {
                return -1;
            }
        };

        const parsedQuery = () => {
            if (query) {
                const queryObj = JSON.parse(query);
                return queryObj;
            }
            return {};
        };

        const productsData = await ProductsModel.paginate(parsedQuery(), {
            limit: limit || 2,
            page: page || 1,
            sort: sort ? { price: isSorted() } : null,
            lean: true,
        });

        const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = productsData;

        const products = docs;
        const user = req.session.user;

        res.render("products", {
            title: "Listado de productos",
            products: products,
            style: "css/styles.css",
            scriptName: "products.js",
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: prevPage,
            currentPage: productsData.page,
            nextPage: nextPage,
            user: user,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        }
        )
        console.log(error)
    }
}
);

router.get("/realtime", async (req, res) => {
    const products = await getProducts(req, res);
    const user = req.session.user;
    console.log(user)
    res.render("realtime", {
        title: "Productos en tiempo real",
        products: products,
        style: "css/styles.css",
        scriptName: "realtime.js",
        user: user,
    });
});


router.get("/chat", async (req, res) => {
    res.render("chat", {
        title: "Chat",
        style: "css/styles.css",
        scriptName: "chat.js",
    });
});

router.get("/carts", async (req, res) => {
    try {
        const carts = await getCarts();
        console.log(carts)
        res.render("carts", {
            title: "Carritos",
            carts: carts,
            style: "css/styles.css",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        })
        console.log(error)
    }
}
);

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await getCartById();
        console.log(cart)
        res.render("cart", {
            title: "Carrito",
            cart: cart,
            style: "../css/styles.css",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        })
        console.log(error)
    }
}
);

export default router;