const express = require("express");
const { login, register, getUserProfile } = require("../controllers/usersController");
const authorize = require("../middlewares/authorize");
const { loginValidation, registerValidation } = require("../middlewares/validations");
const { verifySource } = require("../middlewares/verifySource");
const router = express.Router();

router.post('/register', verifySource(), registerValidation, register)
router.post('/login', verifySource(), loginValidation, login)
router.get('/get-profile', authorize(), getUserProfile)

module.exports = { userRouter: router }