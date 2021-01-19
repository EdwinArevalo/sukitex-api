const router = require('express').Router();
const RoleContoller = require('../controllers/role.controller');
const roleContoller = new RoleContoller();

router.route('/')
    .get(roleContoller.get); 

module.exports = router;