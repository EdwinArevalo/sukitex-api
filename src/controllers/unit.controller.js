const Unit = require('../models/Unit');

module.exports = class UnitContoller { 
    
    async get(req, res) {
        try{
            const Units = await Unit.findAll();
            return res.json({
                code: 200,
                list: Units
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 