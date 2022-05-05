const router = require('express').Router();
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const postRoute = require('./postRoute');

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/post', postRoute);

module.exports = router;