const Color = require('../models/Color');

module.exports = class ColorContoller { 
    
    async get(req, res) {
        try{
            const Colors = await Color.findAll();
            return res.json({
                code: 200,
                list: Colors
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 