const router = require("express").Router();
const userController = require("../controllers/userController");


router.get("/createaccount", userController.createAccountPage);
router.post("/createaccount", userController.createAccount);

router.get("/login", userController.loginPage);
router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/resetpassword", userController.resetPasswordPage);
router.post("/resetpassword", userController.resetPassword);
router.get("/resetpassword/:token", userController.resetPasswordLastStagePage);

router.post("/resetpasswordlaststage/:token", userController.resetPasswordLastStage);
module.exports = router;