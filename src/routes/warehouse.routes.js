const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const WarehouseContoller = require('../controllers/warehouse.controller');
const warehouseContoller = new WarehouseContoller();

router.route('/')
    .get(verifyToken, warehouseContoller.get);

router.route('/getById')
    .post(verifyToken, warehouseContoller.getById);

router.route('/insert')
    .post(verifyToken, warehouseContoller.insert);

router.route('/update')
    .put(verifyToken, warehouseContoller.update);

router.route('/delete')
    .post(verifyToken, warehouseContoller.delete);

module.exports = router;