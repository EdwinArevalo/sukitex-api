const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductContoller = require('../controllers/product.controller');
const productController = new ProductContoller();

router.route('/')
    .get( productController.get);

router.route('/getById')
    .post(verifyToken, productController.getById);

router.route('/getPagination')
    .post(verifyToken, productController.getPagination);

router.route('/insert')
    .post(verifyToken, productController.insert);

router.route('/update')
    .put(verifyToken, productController.update);

router.route('/delete')
    .post(verifyToken, productController.delete);

module.exports = router;