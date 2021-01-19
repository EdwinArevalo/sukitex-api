const ModificationType = require('../models/ModificationType');

module.exports = class ModificationTypeContoller { 
    
    async get(req, res) {
        try{
            const ModificationTypes = await ModificationType.findAll();
            return res.json({
                code: 200,
                list: ModificationTypes
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 