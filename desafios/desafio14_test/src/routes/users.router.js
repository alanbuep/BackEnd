import { Router } from "express";
import UserModel from "../dao/models/users.js";

const router = Router();

router.put("/premium/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        console.log(uid);
        let result;
        const user = await UserModel.findById(uid);
        if (!user) {
            console.log("Usuario no encontrado");
        } else {
            if (user.role === "user") {
                user.role = "premium";
                result = await user.save();
                console.log("El nuevo role ", result.role);
            } else if (user.role === "premium") {
                user.role = "user";
                result = await user.save();
                console.log("El nuevo role ", result.role);
            }
            res.status(200).json({ message: "Role cambiado", data: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
});

export default router;