import { Router } from "express";
import { ProductManager } from "../dao/managers/fsManagers/ProductManager.js";
import Products from "../dao/managers/dbManagers/products.js";
import { ProductsModel } from "../dao/models/products.js";
import { CartsModel } from "../dao/models/carts.js";
import Carts from "../dao/managers/dbManagers/carts.js";
import UserModel from "../dao/models/users.js";
import auth from "../middlewares/auth.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();
const productManager = new ProductManager("../productsList.json");
const productsDB = new Products();
const cartsDB = new Carts();

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
    const products = await productsDB.getAllProducts() || productManager.getProducts();
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
        const carts = await cartsDB.getAllCarts()
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
    const { cid } = req.params;
    try {
        const cart = await cartsDB.getCartById(cid);
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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        const user = await UserModel.findOne({ email });
        console.log(user);
        if (user === null) {
            res.status(400).json({
                error: "Usuario o contraseña incorrectos",
            });
        } else {
            const isMatch = isValidPassword(user.password, password);
            if (!isMatch) {
                res.status(401).json({
                    error: "Contraseña incorrecta",
                });
            } else {
                req.session.user = email;
                req.session.role = user.role;
                res.status(200).json({
                    respuesta: user.role === 'admin' ? 'admin' : 'ok',
                });
            }
        }
    } catch (error) {
        console.log(error)
    }
});

/* router.post("/signup", async (req, res) => {
    try {
        const { first_name, last_name, email, password, birth } = req.body;
        console.log(req.body)
        const newUser = {
            first_name,
            last_name,
            email,
            password,
            birth,
            role: "user",
        };

        const result = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            birth,
        });

        if (result === null) {
            res.status(400).json({
                error: "Error al crear el usuario",
            });
        } else {
            req.session.user = email;
            req.session.role = "admin";
            res.status(201).json({
                respuesta: "Usuario creado con éxito",
            });
        }
    } catch (error) {
        console.log(error)
    }
}); */

router.post(
    "/signup",
    passport.authenticate("register", {
        failureRedirect: "/failRegister",
    }),
    async (req, res) => {
        res.status(201).json({
            respuesta: "Usuario creado con éxito",
            redirectUrl: "/login"
        });
    }
);


router.get("/failRegister", (req, res) => {
    res.status(400).json({
        error: "Error al crear el usuario",
    });
});

router.get("/realtime", auth, (req, res) => {
    res.render("realtime", {
        title: "Administrador de Productos",
        user: req.session.user,
    });
});

router.get("/forgot", (req, res) => {
    res.render("forgot", {
        title: "forgot",
        style: "css/styles.css",
        scriptName: "forgot.js"
    })
});

router.post("/forgot", async (req, res) => {
    const { email, newPassword } = req.body;
    const result = await UserModel.find({
        email: email,
    });

    if (result.length === 0) {
        return res.status(401).json({
            error: "Usuario o contraseña incorrectos",
        });
    } else {
        const respuesta = await UserModel.findByIdAndUpdate(result[0]._id, {
            password: createHash(newPassword),
        });
        res.status(200).json({
            respuesta: "ok",
            datos: respuesta,
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => { }
);

router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user;
        req.session.admin = true;
        res.redirect("/products");
    }
);

export default router;