const Role = require('../models/Role');

module.exports = class RoleContoller { 
    
    async get(req, res) {
        try{
            const Roles = await Role.findAll();
            return res.json({
                code: 200,
                list: Roles
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 