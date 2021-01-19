const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductTransferContoller = require('../controllers/productTransfer.controller');
const productTransferContoller = new ProductTransferContoller();

router.route('/')
    .get(verifyToken,productTransferContoller.get);

router.route('/getPagination')
    .post(verifyToken,productTransferContoller.getPagination);

router.route('/getById')
    .post(verifyToken,productTransferContoller.getById);

router.route('/insert')
    .post(verifyToken,productTransferContoller.insert);
     
module.exports = router;