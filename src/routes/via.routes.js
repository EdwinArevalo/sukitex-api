const router = require('express').Router();
const ViaContoller = require('../controllers/via.controller');
const viaContoller = new ViaContoller();

router.route('/')
    .get(viaContoller.get); 

module.exports = router;