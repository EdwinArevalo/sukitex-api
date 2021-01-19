const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const MaterialContoller = require('../controllers/material.controller');
const materialContoller = new MaterialContoller();

router.route('/')
    .get(verifyToken,materialContoller.get);

router.route('/getById')
    .post(verifyToken,materialContoller.getById);
    
router.route('/getPagination')
    .post(verifyToken,materialContoller.getPagination);

router.route('/insert')
    .post(verifyToken,materialContoller.insert);

router.route('/update')
    .put(verifyToken,materialContoller.update);

router.route('/delete')
    .post(verifyToken,materialContoller.delete);

module.exports = router;