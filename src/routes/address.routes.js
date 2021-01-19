const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const AddressContoller = require('../controllers/address.controller');
const addressContoller = new AddressContoller();

router.route('/')
    .get(verifyToken,addressContoller.get);

router.route('/getById')
    .post(verifyToken,addressContoller.getById);
 

module.exports = router;