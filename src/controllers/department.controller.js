const Department = require('../models/Department');

module.exports = class DepartmentContoller { 
    
    async get(req, res) {
        try{
            const Departments = await Department.findAll();
            return res.json({
                code: 200,
                list: Departments
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 