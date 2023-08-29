const express = require("express");
const router = express.Router();
const TagController = require("../controllers/tagController");
const authentication = require("../middlewares/authentication");

router.get("/all-tag", TagController.findAllTag);
router.post("/create-tag", TagController.createTag);


module.exports = router;
