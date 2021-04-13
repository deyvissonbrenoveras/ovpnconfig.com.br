const router = require("express").Router();
const buyController = require("../controllers/buyController");
const userAuthController = require("../controllers/userAuthController");

router.use(userAuthController.forceAuth);


router.get("/", buyController.buyPage);
router.post("/", buyController.buy);
router.get("/success", buyController.success);
router.get("/cancel", buyController.cancel);

module.exports = router;