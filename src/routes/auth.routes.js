const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const AuthContoller = require('../controllers/auth.controller');
const authContoller = new AuthContoller();

router.route('/signIn')
    .post(authContoller.signIn);

router.route('/signUp')
    .post(authContoller.signUp);

router.route('/isLogged')
    .post(verifyToken,authContoller.isLogged);

router.route('/sendEmail')
    .post(authContoller.sendEmail);

module.exports = router;