import { Router } from "express";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

import { cartsByIdView, cartsView, chatView, getPaginateProducts, realtimePaginate } from "../controller/views.controller.js";

const router = Router();

router.get("/products", authUser, getPaginateProducts);

router.get("/realtime", authAdmin, realtimePaginate);

router.get("/chat", authUser, chatView);

router.get("/carts", cartsView);

router.get("/carts/:cid", cartsByIdView);

export default router;