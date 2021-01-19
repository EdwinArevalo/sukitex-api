const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const UnitContoller = require('../controllers/unit.controller');
const unitContoller = new UnitContoller();

router.route('/')
    .get(verifyToken, unitContoller.get); 

module.exports = router;