const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MaterialStockRecord = require('../controllers/materialStockRecord.controller');
const materialStockRecord = new MaterialStockRecord();

router.route('/')
    .get(verifyToken,materialStockRecord.get);

router.route('/getById')
    .post(verifyToken,materialStockRecord.getById); 

router.route('/getPagination')
    .post(verifyToken,materialStockRecord.getPagination); 

router.route('/getByWarehousePagination')
    .post(verifyToken,materialStockRecord.getbyWarehousePagination); 

module.exports = router;