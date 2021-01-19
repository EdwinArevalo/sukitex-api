const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductPurchaseContoller = require('../controllers/productPurchase.controller');
const productPurchaseContoller = new ProductPurchaseContoller();

router.route('/')
    .get(verifyToken, productPurchaseContoller.get);

router.route('/getPagination')
    .post(verifyToken, productPurchaseContoller.getPagination);

router.route('/getById')
    .post(verifyToken, productPurchaseContoller.getById);

router.route('/insert')
    .post(verifyToken, productPurchaseContoller.insert);
     
module.exports = router;