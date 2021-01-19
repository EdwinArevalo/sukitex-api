const router = require('express').Router();
const DepartmentController = require('../controllers/department.controller');
const departmentController = new DepartmentController();

router.route('/')
    .get(departmentController.get); 

module.exports = router;