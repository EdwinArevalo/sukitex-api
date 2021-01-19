const Size = require('../models/Size');

module.exports = class SizeContoller { 
    
    async get(req, res) {
        try{
            const sizes = await Size.findAll();
            return res.json({
                code: 200,
                list: sizes
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 