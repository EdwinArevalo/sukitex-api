const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const SizeContoller = require('../controllers/size.controller');
const sizeContoller = new SizeContoller();

router.route('/')
    .get(verifyToken,sizeContoller.get); 

module.exports = router;