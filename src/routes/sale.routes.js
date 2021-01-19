const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const SaleContoller = require('../controllers/sale.controller');
const saleContoller = new SaleContoller();

router.route('/')
    .get(verifyToken,saleContoller.get);

router.route('/getPagination')
    .post(verifyToken,saleContoller.getPagination);

router.route('/getById')
    .post(verifyToken,saleContoller.getById);

router.route('/insert')
    .post(verifyToken,saleContoller.insert); 

module.exports = router;