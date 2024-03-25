import express from "express"
import { processTransaction } from "../controller/payment.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const router = new express.Router();


// router.use(authMiddleware);

router.post("/proccess-transaction", processTransaction);
router.patch("/users/current", userController.update);



export {
    router,
}