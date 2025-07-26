import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import {registerController, loginController, genRefreshToken, getUserProfileController, logoutController, updateProfileController, changePasswordController, forgotPasswordController, resetPasswordController} from '../controllers/userController.js';


const router = express.Router();

router.post("/register" , registerController );
router.post("/login" , loginController );
router.get('/refresh-token',isAuth, genRefreshToken);
router.get("/get-user-profile",isAuth, getUserProfileController);
router.get("/logout",isAuth, logoutController);
router.put("/update-profile", isAuth, updateProfileController);
router.put("/change-password", isAuth, changePasswordController);
//Send Reset Link
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);




export default router;