const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MaterialStockContoller = require('../controllers/materialStock.controller');
const materialStockContoller = new MaterialStockContoller();

router.route('/')
    .get(verifyToken, materialStockContoller.get);

router.route('/getPagination')
    .post(verifyToken, materialStockContoller.getPagination);

router.route('/getById')
    .post(verifyToken, materialStockContoller.getById);

router.route('/getByWarehouse')
    .post(verifyToken, materialStockContoller.getByWarehouse);

router.route('/insert')
    .post(verifyToken, materialStockContoller.insert);

router.route('/update')
    .put(verifyToken, materialStockContoller.update);

router.route('/delete')
    .post(verifyToken, materialStockContoller.delete);

module.exports = router;