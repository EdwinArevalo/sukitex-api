const AdjustmentReason = require('../models/AdjustmentReason');

module.exports = class AdjustmentReasonContoller { 
    
    async get(req, res) {
        try{
            const AdjustmentReasons = await AdjustmentReason.findAll();
            return res.json({
                code: 200,
                list: AdjustmentReasons
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 