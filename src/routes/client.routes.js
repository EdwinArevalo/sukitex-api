const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ClientContoller = require('../controllers/client.controller');
const clientContoller = new ClientContoller();

router.route('/')
    .get(verifyToken, clientContoller.get);

router.route('/getPagination')
    .post(verifyToken, clientContoller.getPagination);

router.route('/getById')
    .post(verifyToken, clientContoller.getById);

router.route('/insert')
    .post(verifyToken, clientContoller.insert);

router.route('/update')
    .put(verifyToken, clientContoller.update);

router.route('/delete')
    .post(verifyToken, clientContoller.delete);

module.exports = router;