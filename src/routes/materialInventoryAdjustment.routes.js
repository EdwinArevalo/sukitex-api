const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MaterialInventoryAdjustmentContoller = require('../controllers/materialInventoryAdjustment.controller');
const materialInventoryAdjustmentContoller = new MaterialInventoryAdjustmentContoller();

router.route('/')
    .get(verifyToken,materialInventoryAdjustmentContoller.get);

router.route('/getPagination')
    .post(verifyToken,materialInventoryAdjustmentContoller.getPagination);

router.route('/getById')
    .post(verifyToken,materialInventoryAdjustmentContoller.getById);

router.route('/insert')
    .post(verifyToken,materialInventoryAdjustmentContoller.insert); 

module.exports = router;