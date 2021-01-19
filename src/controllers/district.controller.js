const District = require('../models/District');
const Department = require('../models/Department');

module.exports = class DistrictContoller { 
    
    async getByDepartment(req, res) {
        const {departmentId} = req.body;

        try{
            const Districts = await District.findAll({
                include: Department,
                where: {
                    departmentId
                }
            });
            return res.json({
                code: 200,
                list: Districts
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 