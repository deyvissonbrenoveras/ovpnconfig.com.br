const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");
const bodyParser = require("body-parser");
const userAuthController = require("../controllers/userAuthController");


router.get("*", appController.redirectHttps);
router.use(userAuthController.checkUser);

router.get("/", appController.index);
router.get("/about", appController.sobre);
router.post("/generateconfig", bodyParser.json(), appController.checkUserLimit, appController.generateConfig);
module.exports = router;