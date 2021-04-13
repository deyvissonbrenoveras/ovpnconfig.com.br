const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/", blogController.home);
router.get("/:postUrl", blogController.post);
module.exports = router;