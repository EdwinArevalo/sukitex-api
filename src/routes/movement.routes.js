const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MovementContoller = require('../controllers/movement.controller');
const movementContoller = new MovementContoller();

router.route('/')
    .get(verifyToken,movementContoller.get); 

module.exports = router;