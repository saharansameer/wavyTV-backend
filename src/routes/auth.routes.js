import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";

const router = Router();

router.route("/signup").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    asyncHandler(registerUser)
);

router.use(errorHandler);

export default router;