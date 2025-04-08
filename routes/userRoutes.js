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



router.post("/v1/user/add-address", UserAdressController.addUserAddress);
router.get("/v1/user/get-address", UserAdressController.getUserAddresses);
router.put("/v1/user/update-address", UserAdressController.updateUserAddress);
router.delete("/v1/user/delete-address", UserAdressController.deleteUserAddress);
router.put("/v1/user/address/set-default", UserAdressController.setDefaultAddress);

router.get("/v1/user/get-recomended-products",authenticateToken, UserController.getUserRecommendedProducts);

module.exports = router;