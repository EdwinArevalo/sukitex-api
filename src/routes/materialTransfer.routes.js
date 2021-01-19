const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MaterialTransferContoller = require('../controllers/materialTransfer.controller');
const materialTransferContoller = new MaterialTransferContoller();

router.route('/')
    .get(verifyToken, materialTransferContoller.get);

router.route('/getPagination')
    .post(verifyToken, materialTransferContoller.getPagination);

router.route('/getById')
    .post(verifyToken, materialTransferContoller.getById);

router.route('/insert')
    .post(verifyToken, materialTransferContoller.insert);
     
module.exports = router;