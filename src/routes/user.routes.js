const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const UserContoller = require('../controllers/user.controller');
const userContoller = new UserContoller();

router.route('/')
    .get(verifyToken, userContoller.get);

router.route('/getPagination')
    .post(verifyToken, userContoller.getPagination);

router.route('/getById')
    .post(verifyToken, userContoller.getById);
 
router.route('/update')
    .put(verifyToken, userContoller.update);

router.route('/delete')
    .post(verifyToken, userContoller.delete);

module.exports = router;