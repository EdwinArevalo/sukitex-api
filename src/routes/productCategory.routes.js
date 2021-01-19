const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ProductCategory = require('../controllers/productCategory.controller');
const productCategory = new ProductCategory();

router.route('/')
    .get(verifyToken,productCategory.get); 

module.exports = router;