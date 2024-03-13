import { Router } from "express";
import { ProductsModel } from "../dao/models/products.js";
import auth from "../middlewares/auth.js";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";
import { getCarts, getCartById, addCart, addProductToCart, updateCart, updateProductQuantity, deleteCart, deleteProductCart } from "../controller/carts.controller.js"

const router = Router();

router.get("/products", authUser, async (req, res) => {
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

router.get("/realtime", authAdmin, async (req, res) => {
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

        res.render("realtime", {
            title: "Administrador de productos",
            products: products,
            style: "css/styles.css",
            scriptName: "realtime.js",
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
});


router.get("/chat", authUser, async (req, res) => {
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