const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const cookieParser = require("cookie-parser");



router.get("/newpost", postController.newPostPage);
router.get("/posts", postController.postsPage);
router.get("/editpost/:postId", postController.editPostPage);

router.post("/newpost",  postController.postValidation, postController.newPost);
router.post("/editpost", postController.postValidation, postController.editPost);

module.exports = router;