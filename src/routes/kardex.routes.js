const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductStockRecord = require('../controllers/productStockRecord.controller');
const MaterialStockRecord = require('../controllers/materialStockRecord.controller');
const productStockRecord = new ProductStockRecord();
const materialStockRecord = new MaterialStockRecord();

router.route('/getProductKardex')
    .post(verifyToken, productStockRecord.getProductKardex);

router.route('/getMaterialKardex')
    .post(verifyToken, materialStockRecord.getMaterialKardex);

module.exports = router; 