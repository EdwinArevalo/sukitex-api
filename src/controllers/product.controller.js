const Product = require('../models/Product'); 
const ProductCategory = require('../models/ProductCategory'); 
const { Op } = require("sequelize");
const Pagination = require('../helpers/pagination');

module.exports = class ProductContoller {

    async getById(req, res, next) {
        try{
            const {productId} = req.body;
            const product = await Product.findOne({
                where: {
                    productId
                },
                include: [ProductCategory]
              })

            return res.json({
                code: 200,
                object: product
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        }
        
    }
    
    async get(req, res) {
        try{
            const products = await Product.findAll({
                include: [ProductCategory],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: products
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }

    async getPagination(req, res) {
        try{
            const {page, size} = req.body;
            const {limit , offset} =Pagination.getPagination(page, size);
            const products = await Product.findAndCountAll({
                include: [ProductCategory],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(products,page,limit);

            return res.json({
                code: 200,
                ...response
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        }
    }

    async insert(req, res) {
        try{
            const {productName, productDescription,productCategoryId } = req.body;
            if(productName == null || typeof productName == 'undefined'){
                return res.json({
                    code: 0,
                    msg: 'El nombre del producto es requerido!'
                });
            }

            const product = await Product.findOne({
                where: {
                    productName
                }
            });

            if(product != null) {

                return res.json({
                    code: 0,
                    msg: 'Ya existe un producto registrado con ese nombre!'
                });

            }else{ 
                const newProdcut =  await Product.create({
                    productName,
                    productCategoryId,
                    productDescription
                });

                return res.json({
                    code: 200,
                    object: newProdcut
                });

            } 

        }catch(err) {
            return res.status(400).json({
                code: 0,
                msg: 'Se ha producido un error al guardar los datos!',
                error: err
            });
        }   
    }

    async update(req, res){
        try{
            const {productId, productName, productDescription} = req.body;                        
            
            if(productName == null || typeof productName == 'undefined') {                

                const productUpdated = await Product.update({ productDescription,  updatedAt: new Date()}, {
                    where: {
                        productId
                    }
                });
    
                return res.json({
                    code: productUpdated[0]
                });

            } else {
                const product = await Product.findOne({
                    where: {
                        productName,
                        productId: {
                            [Op.not]: productId
                        }
                    }
                });
    
                if(product != null){
                    return res.json({
                        code: 0,
                        msg: 'Ya existe un producto registrano con ese nombre!.'
                    });
                }

                const productUpdated = await Product.update({ productName, productDescription,  updatedAt: new Date()}, {
                    where: {
                        productId
                    }
                });
    
                return res.json({
                    code: productUpdated[0]
                });
            } 
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                msg: 'Se ha producido un error al actualizar los datos!',
                error: err
            });
        } 
    }

    async delete(req, res){
        try{
            const {productId} = req.body;
            const productDesabled= await Product.update({ enabled: false}, {
                where: {
                    productId
                }
            });

            return res.json({
                code: productDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 