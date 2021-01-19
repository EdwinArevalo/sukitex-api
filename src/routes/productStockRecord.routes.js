const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductStockRecord = require('../controllers/productStockRecord.controller');
const productStockRecord = new ProductStockRecord();

router.route('/')
    .get(verifyToken,productStockRecord.get);

router.route('/getById')
    .post(verifyToken,productStockRecord.getById); 

router.route('/getPagination')
    .post(verifyToken,productStockRecord.getPagination); 

router.route('/getByWarehousePagination')
    .post(verifyToken,productStockRecord.getbyWarehousePagination); 

module.exports = router; 