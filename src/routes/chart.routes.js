const router = require('express').Router();
const verifyToken = require('../middlewares/authJwt'); 
const ChartContoller = require('../controllers/chart.controller');
const chartContoller = new ChartContoller();

router.route('/getSalesByWeekDay')
    .post(verifyToken, chartContoller.getSalesByWeekDay);

router.route('/getSalesByMonth')
    .get(verifyToken, chartContoller.getSalesByMonth);

router.route('/getSalesByYear')
    .get(verifyToken, chartContoller.getSalesByYear);

module.exports = router;