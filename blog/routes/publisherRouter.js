const express = require("express");
const router = express.Router();
const publisherController = require("../controllers/publisherController");

router.get("/newpublisher", publisherController.newPublisherPage);
router.get("/publishers", publisherController.publishersPage);
router.get("/editpublisher/:publisherId", publisherController.editPublisherPage);

router.post("/newpublisher", publisherController.publisherValidation, publisherController.newPublisher);
router.post("/editpublisher", publisherController.editPublisher);

module.exports = router;