const express = require("express");
const router = express.Router();
const ImageController = require("../controllers/imageController");
const authentication = require("../middlewares/authentication");

router.get("/all-post", ImageController.getAllPost);
router.put('/edit-post/:imageId', authentication, ImageController.updatePostImage)
router.post("/create-post", authentication, ImageController.createPostImage);
router.delete("/delete-post/:imageId", authentication, ImageController.deletePost);
router.post("/like/:imageId", authentication, ImageController.likeImage);
router.delete("/unlike/:imageId", authentication, ImageController.unlikeImage);
router.get('/cek-like/:imageId', authentication,ImageController.cekUserIsLike)

module.exports = router;
