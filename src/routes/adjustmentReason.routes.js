const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const AdjustmentReason = require('../controllers/adjustmentReason.controller');
const adjustmentReason = new AdjustmentReason();

router.route('/')
    .get(verifyToken,adjustmentReason.get); 

module.exports = router;