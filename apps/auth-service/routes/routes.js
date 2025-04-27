import express from "express";
import registerUser from "../controller/registerUser.js";
import loginUser from "../controller/loginUser.js";
import logOutUser from "../controller/logOutUser.js";
import verify_email from "../controller/verify_email.js";
import verify_mobileNo from "../controller/verify_mobileNo.js";
import set_password from "../controller/set_password.js";
import checkEmailVerified from "../controller/checkEmailVerified.js";
import authCheck from "../controller/authCheck.js";
import getTokenExpiry from "../controller/getTokenExpiry.js";
import authMiddleware from "../middleware/authMiddleware.js";
import profileDetails from "../controller/profileDetails.js";

const router = express.Router();

router.post("/user/registerUser", registerUser);
router.post("/user/loginUser", loginUser);

router.get("/verify/checkEmailVerified", checkEmailVerified);
router.get("/verify/verify_email", verify_email);
router.post("/verify/verify_mobileNo", verify_mobileNo);

router.post("/user/set_password", set_password);
router.get("/user/profileDetails", authMiddleware, profileDetails);
router.get("/user/logOutUser", authMiddleware, logOutUser);

router.get("/auth/check", authCheck);
router.get("/auth/getTokenExpiry", authMiddleware, getTokenExpiry);

export default router;
