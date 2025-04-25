"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menu_controller_1 = require("../controller/menu.controller");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const validateRequest_1 = require("../middlewares/validateRequest");
const multer_1 = __importDefault(require("../middlewares/multer"));
const menuValidation_1 = require("../validations/menuValidation");
const router = express_1.default.Router();
router.route("/").post(isAuthenticated_1.isAuthenticated, multer_1.default.single("image"), (0, validateRequest_1.validateRequest)(menuValidation_1.addMenuSchema), menu_controller_1.addMenu);
router.route("/:id").put(isAuthenticated_1.isAuthenticated, multer_1.default.single("image"), (0, validateRequest_1.validateRequest)(menuValidation_1.editMenuSchema), menu_controller_1.editMenu);
exports.default = router;
