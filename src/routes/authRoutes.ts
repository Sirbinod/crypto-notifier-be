import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validatorHandler } from "../middlewares/validatorHandler";
import { loginUserSchema, registerUserSchema } from "../schemas/userSchema";

const router = Router();
const controller = new UserController();

router.post("/register",validatorHandler(registerUserSchema, "body"), controller.registerUser);
router.post("/login",validatorHandler(loginUserSchema, "body"), controller.loginUser);

export default router;
