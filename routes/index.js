const express = require('express');
const router = express.Router()

const userRouter = require('./user')
const tagRouter = require('./tag')
const postRouter = require('./image')


router.use(userRouter);
router.use(tagRouter);
router.use(postRouter);



module.exports = router