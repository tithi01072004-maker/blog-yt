import express from "express"
import { getAllUsers, login, logout, register, updateProfile } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"

const router=express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile/update").put(isAuthenticated,singleUpload,updateProfile)
router.route("/all-users").get(getAllUsers)
router.route("/me").get(isAuthenticated, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user, // user added by middleware
    });
});

export default router;