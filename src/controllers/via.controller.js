const Via = require('../models/Via');

module.exports = class ViaContoller { 
    
    async get(req, res) {
        try{
            const vias = await Via.findAll();
            return res.json({
                code: 200,
                list: vias
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 