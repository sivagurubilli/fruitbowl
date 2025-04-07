const express = require("express");
const UserController = require("../controller/UserController");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();
module.exports = router;

router.post("/v1/user/send-otp", UserController.sendOtp);
router.post("/v1/user/verify-otp", UserController.verifyOtp);
router.post(
  "/v1/user/update-profile",
  authenticateToken,
  UserController.updateProfile 
);
router.post(
  "/v1/user/check-bmi",
  authenticateToken,
  UserController.checkBMI 
);




router.post("/v1/user/get-recomended-products",authenticateToken, UserController.getUserRecommendedProducts);

module.exports = router;