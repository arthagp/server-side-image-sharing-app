const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

router.get("/all-user", UserController.getAllUser);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
