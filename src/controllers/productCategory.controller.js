const ProductCategory = require('../models/ProductCategory');

module.exports = class ProductCategoryContoller { 
    
    async get(req, res) {
        try{
            const ProductCategories = await ProductCategory.findAll();
            return res.json({
                code: 200,
                list: ProductCategories
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
 
}
 

 