const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductVariant = require('../controllers/productVariant.controller');
const productVariant = new ProductVariant();

router.route('/')
    .get(verifyToken, productVariant.get);
    
router.route('/getPagination')
    .post(verifyToken, productVariant.getPagination);

router.route('/getById')
    .post(verifyToken, productVariant.getById);

router.route('/getByVariant')
    .post(verifyToken, productVariant.getByVariant);

router.route('/insert')
    .post(verifyToken, productVariant.insert);

router.route('/update')
    .put(verifyToken, productVariant.update);

router.route('/delete')
    .post(verifyToken, productVariant.delete);

module.exports = router;