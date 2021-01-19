const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductStockContoller = require('../controllers/productStock.controller');
const productStockContoller = new ProductStockContoller();

router.route('/')
    .get(verifyToken,productStockContoller.get);

router.route('/getPagination')
    .post(verifyToken,productStockContoller.getPagination);

router.route('/getById')
    .post(verifyToken,productStockContoller.getById);

router.route('/getByWarehouse')
    .post(verifyToken,productStockContoller.getByWarehouse);

router.route('/insert')
    .post(verifyToken,productStockContoller.insert);

router.route('/update')
    .put(verifyToken,productStockContoller.update);

router.route('/delete')
    .post(verifyToken,productStockContoller.delete);

module.exports = router;