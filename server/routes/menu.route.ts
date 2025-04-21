import express from "express";
import { addMenu, editMenu } from "../controller/menu.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { validateRequest } from "../middlewares/validateRequest";
import upload from "../middlewares/multer";
import { addMenuSchema, editMenuSchema, idParamSchema, editMenuRequestSchema } from "../validations/menuValidation";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), validateRequest(addMenuSchema), addMenu);
router.route("/:id").put(isAuthenticated, upload.single("image"), validateRequest(editMenuSchema), editMenu);


export default router;