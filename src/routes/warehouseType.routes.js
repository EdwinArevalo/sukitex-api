const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const WarehouseTypeContoller = require('../controllers/warehouseType.controller');
const warehouseTypeContoller = new WarehouseTypeContoller();

router.route('/')
    .get(verifyToken, warehouseTypeContoller.get); 

module.exports = router;