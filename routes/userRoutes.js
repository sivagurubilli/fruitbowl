const express = require("express");
const UserController = require("../controller/UserController");
const UserAdressController = require("../controller/AddressController");
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



router.post("/v1/user/add-address",authenticateToken, UserAdressController.addUserAddress);
router.get("/v1/user/get-address",authenticateToken, UserAdressController.getUserAddresses);
router.post("/v1/user/update-address", authenticateToken,UserAdressController.updateUserAddress);
router.post("/v1/user/delete-address", authenticateToken,UserAdressController.deleteUserAddress);
router.post("/v1/user/address/set-default", authenticateToken,UserAdressController.setDefaultAddress);

router.get("/v1/user/get-recomended-products",authenticateToken, UserController.getUserRecommendedProducts);

module.exports = router;