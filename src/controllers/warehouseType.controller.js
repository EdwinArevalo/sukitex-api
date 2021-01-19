const WarehouseType = require('../models/WarehouseType');

module.exports = class WarehouseTypeContoller { 
    
    async get(req, res) {
        try{
            const WarehouseTypes = await WarehouseType.findAll();
            return res.json({
                code: 200,
                list: WarehouseTypes
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 