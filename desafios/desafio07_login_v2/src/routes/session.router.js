import { Router } from "express";
import UserModel from "../dao/models/users.js";
import auth from "../middlewares/auth.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

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
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const result = await UserModel.findOne({ email, password });

//     if (result === null) {
//         res.status(400).json({
//             error: "Usuario o contraseña incorrectos",
//         });
//     } else {
//         req.session.user = email;
//         req.session.role = "admin";
//         res.status(200).json({
//             respuesta: "ok",
//         });
//     }
// });

// router.post("/signup", async (req, res) => {
//     const { first_name, last_name, email, password, birth } = req.body;
//     console.log(req.body)
//     const newUser = {
//         first_name,
//         last_name,
//         email,
//         password,
//         birth,
//         role: "user",
//     };

//     const result = await UserModel.create({
//         first_name,
//         last_name,
//         email,
//         password,
//         birth,
//     });

//     if (result === null) {
//         res.status(400).json({
//             error: "Error al crear el usuario",
//         });
//     } else {
//         req.session.user = email;
//         req.session.role = "admin";
//         res.status(201).json({
//             respuesta: "Usuario creado con éxito",
//         });
//     }
// });

// router.get("/realtime", auth, (req, res) => {
//     res.render("realtime", {
//         title: "Administrador de Productos",
//         user: req.session.user,
//     });
// });

export default router;