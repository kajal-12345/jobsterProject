const {Router} = require('express');
const isAuth = require('../middleware/isAuth');//
const { postSignup, postSignin, updateUser } = require('../controller/auth');
const router = Router();
router.post('/auth/register',postSignup);
router.post('/auth/login',postSignin);
router.patch('/auth/updateUser/:userId',isAuth,updateUser);
module.exports = router;  