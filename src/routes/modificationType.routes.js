const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ModificationType = require('../controllers/modificationType.controller');
const modificationType = new ModificationType();

router.route('/')
    .get(verifyToken,modificationType.get); 

module.exports = router;