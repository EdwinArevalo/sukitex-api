const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MaterialPurchaseContoller = require('../controllers/materialPurchase.controller');
const materialPurchaseContoller = new MaterialPurchaseContoller();

router.route('/')
    .get(verifyToken,materialPurchaseContoller.get);

router.route('/getPagination')
    .post(verifyToken,materialPurchaseContoller.getPagination);

router.route('/getById')
    .post(verifyToken,materialPurchaseContoller.getById);

router.route('/insert')
    .post(verifyToken,materialPurchaseContoller.insert);
     
module.exports = router;