const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ColorController = require('../controllers/color.controller');
const colorController = new ColorController();

router.route('/')
    .get(verifyToken, colorController.get); 

module.exports = router;