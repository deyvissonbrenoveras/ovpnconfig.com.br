const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");



router.get("/login", loginController.loginPage);
router.get("/logout", loginController.logout);

router.post("/login", loginController.login);

module.exports = router;