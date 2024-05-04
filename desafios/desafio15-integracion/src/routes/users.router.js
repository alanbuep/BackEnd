import { Router } from "express";
import UserModel from "../dao/models/users.js";
import multer from "multer";
import { __dirname } from "../utils.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profileImage") {
            cb(null, __dirname + '/docs/profileImage');
        } else if (file.fieldname === "productImage") {
            cb(null, __dirname + '/docs/profileImage');
        } else {
            cb(null, __dirname + '/docs/profileImage');
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find().lean();
        if (!users) {
            console.log("Usuarios no encontrado");
        } else {
            res.status(200).json({ message: "Lista de ususarios", data: users });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

router.put("/premium/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        console.log(uid);
        let result;
        const user = await UserModel.findById(uid);
        if (!user) {
            console.log("Usuario no encontrado");
        } else {
            const hasRequiredDocuments =
                user.documents &&
                user.documents.length >= 3 &&
                user.documents.some((doc) =>
                    ["Identificación", "Comprobante de domicilio", "Comprobante de estado de cuenta"].includes(doc.name)
                );
            if (hasRequiredDocuments) {
                user.role = "premium";
                result = await user.save();
                console.log("El nuevo rol: ", result.role);
                res.status(200).json({ message: "Rol cambiado a premium", data: result });
            } else {
                console.log("No se han cargado todos los documentos requeridos");
                res.status(400).json({ message: "No cumples con los requisitos para ser premium o no se han cargado todos los documentos requeridos" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

router.post("/:uid/documents", upload.single("document"), async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await UserModel.findById(uid);
        if (!user) {
            console.log("Usuario no encontrado");
        } else {
            res.status(200).json({ message: "Documento subido correctamente" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error,
        });
    }
});

export default router;