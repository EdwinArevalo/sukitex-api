const router = require('express').Router();
const DistrictContoller = require('../controllers/district.controller');
const districtContoller = new DistrictContoller();

router.route('/getByDepartment')
    .post(districtContoller.getByDepartment); 

module.exports = router;