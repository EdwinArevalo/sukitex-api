const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProviderContoller = require('../controllers/provider.controller');
const providerContoller = new ProviderContoller();

router.route('/')
    .get(verifyToken,providerContoller.get);

router.route('/getPagination')
    .post(verifyToken,providerContoller.getPagination);

router.route('/getById')
    .post(verifyToken,providerContoller.getById);

router.route('/insert')
    .post(verifyToken,providerContoller.insert);

router.route('/update')
    .put(verifyToken,providerContoller.update);

router.route('/delete')
    .post(verifyToken,providerContoller.delete);

module.exports = router;