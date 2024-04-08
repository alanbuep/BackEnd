import { Router } from "express";
import UserModel from "../dao/models/users.js";
import auth from "../middlewares/auth.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";
import { mailRestore } from "../services/mail/restore.password.js";

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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        if (!email || !password) {
            res.status(400).json({ error: "Faltan datos" });
        } else {
            const user = await UserModel.findOne({ email });
            console.log(user)
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
                    const myToken = generateToken({ email });
                    console.log(myToken);
                    req.session.user = email;
                    req.session.role = user.role;
                    res
                        .cookie("TG_CookieToken", myToken, {
                            maxAge: 60 * 60 * 1000,
                            httpOnly: true,
                        })
                        .status(200)
                        .json({ status: "success", token: myToken, respuesta: user.role === 'admin' ? 'admin' : 'ok', });
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
});

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

// router.get("/current", passportCall("jwt"), authorization("admin"), (req, res) => {
//     res.status(200).json(req.user);
// });

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

router.get("/restorepasswordemail", authUser, mailRestore);

router.get("/restorepassword", (req, res) => {
    const user = req.session.user;
    const { timestamp } = req.query;
    try {
        const linkTimestamp = parseInt(timestamp, 10);
        const now = Date.now();
        const expirationTime = 60 * 60 * 1000;
        const timeDifference = now - linkTimestamp;

        if (timeDifference > expirationTime) {
            return res.redirect("/login");
        }
        res.render("restore", {
            title: "restore",
            style: "css/styles.css",
            scriptName: "restore.js",
            user: user,
        })
    } catch (error) {
        console.error("Error al verificar el enlace:", error);
        res.status(400).json({ status: "error", message: "El enlace ha expirado" });
    }
});

router.put("/resetpassword",
    async (req, res) => {
        try {
            const user = await UserModel.findOne({ email: req.session.user });
            console.log(user)
            console.log(req.body.currentPassword)
            console.log(req.body.newPassword)
            if(user){
            const isMatch = isValidPassword(user.password, req.body.currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
            user.password = createHash(req.body.newPassword);
            await user.save();
            res.status(201).json({ status: "success",message: "Contraseña cambiada con éxito" });
        }else{
            res.status(500).json({ message: "Error con el usuario al cambiar la contraseña" });
        }
    } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            res.status(500).json({ message: "Error al cambiar la contraseña" });
        }
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