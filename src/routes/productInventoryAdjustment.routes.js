const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductInventoryAdjustmentContoller = require('../controllers/productInventoryAdjustment.controller');
const productInventoryAdjustmentContoller = new ProductInventoryAdjustmentContoller();

router.route('/')
    .get(verifyToken,productInventoryAdjustmentContoller.get);

router.route('/getPagination')
    .post(verifyToken,productInventoryAdjustmentContoller.getPagination);

router.route('/getById')
    .post(verifyToken,productInventoryAdjustmentContoller.getById);

router.route('/insert')
    .post(verifyToken,productInventoryAdjustmentContoller.insert); 

module.exports = router;