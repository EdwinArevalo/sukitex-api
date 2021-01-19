const { Op } = require("sequelize");
const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Size = require('../models/Size');
const Color = require('../models/Color');

const Pagination = require('../helpers/pagination'); 

module.exports = class ProductVariantContoller {

    async getById(req, res, next) {
        try{
            const {productVariantId} = req.body;
            const productVariant = await ProductVariant.findOne({
                where: {
                    productVariantId
                },
                include: [Size, Color, {
                    model: Product,
                    include: ProductCategory
                }]
              })

            return res.json({
                code: 200,
                object: productVariant
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
            const productVariants = await ProductVariant.findAll({
                include: [Size, Color, {
                    model: Product,
                    include: ProductCategory
                }],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: productVariants
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
            const productVariants = await ProductVariant.findAndCountAll({
                include: [Size, Color, {
                    model: Product,
                    include: ProductCategory
                }],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(productVariants,page,limit);

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

    async getByVariant(req, res, next) {
        try{
            var productVariantFilter;

            let {productId, sizeId, colorId } = req.body; 
            productId = productId != null ?  productId: null;
            sizeId = sizeId != null ?  sizeId: null;
            colorId = colorId != null ?  colorId: null;

            if(productId != null && sizeId != null && colorId != null){ 
                productVariantFilter = await ProductVariant.findAll({
                    where: {
                        productId,
                        sizeId,
                        colorId
                    },
                    include: [Size, Color,Product]                
                });

            }else if(productId != null && sizeId != null){
                productVariantFilter = await ProductVariant.findAll({
                    where: {
                        productId,
                        sizeId
                    },
                    include: [Size, Color,Product]                
                });

            }else if(productId != null && colorId != null){
                productVariantFilter = await ProductVariant.findAll({
                    where: {
                        productId,
                        colorId
                    },
                    include: [Size, Color,Product]                
                });

            } else if(sizeId != null && colorId != null){
                productVariantFilter = await ProductVariant.findAll({
                    where: {
                        sizeId,
                        colorId
                    },
                    include: [Size, Color,Product]                
                });

            } else if(productId != null ){
                productVariantFilter = await ProductVariant.findAll({
                    where: {
                        productId
                    },
                    include: [Size, Color,Product]                
                });

            } else if(colorId != null){
                productVariantFilter = await ProductVariant.findAll({
                    where: { 
                        colorId
                    },
                    include: [Size, Color,Product]                
                });

            } else if(sizeId != null ){
                productVariantFilter = await ProductVariant.findAll({
                    where: {
                        sizeId
                    },
                    include: [Size, Color,Product]                
                });

            } else {  
                productVariantFilter = await ProductVariant.findAll({
                    include: [Size, Color,Product]
                });
            }

            return res.json({
                code: 200,
                list: productVariantFilter
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
            const {productId, sizeId, colorId } = req.body;

            const productVariant = await ProductVariant.findOne({
                where: {
                    productId,
                    sizeId,
                    colorId
                }
              });

            if(productVariant!=null){ 
                return res.json({
                    code: 0,
                    msg: 'Already exists a product variant registered with that characteristics!.'
                });

            } else {
                const newProdcutVariant =  await ProductVariant.create({
                    productId,
                    sizeId,
                    colorId
                });
    
                return res.json({
                    code: 200,
                    object: newProdcutVariant
                });
            }
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        }   
    }

    async update(req, res){
        try{
            const {productVariantId, sizeId, colorId} = req.body;

            const productVariantExists = await ProductVariant.findOne({
                where: {
                    productVariantId
                }
            });

            const productVariant = await ProductVariant.findOne({
                where: {
                    productId: productVariantExists.productId,
                    colorId: colorId,
                    sizeId: sizeId,
                }
            });

            if(productVariant != null){
                return res.json({
                    code: 0,
                    msg: 'Already exists a product variant registered with that characteristics!.'
                });

            }else {
                const productVariantUpdated = await ProductVariant.update({  sizeId, colorId, updatedAt: new Date()}, {
                    where: {
                        productVariantId
                    }
                });
    
                return res.json({
                    code: productVariantUpdated[0]
                });
            }
 
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }

    async delete(req, res){
        try{
            const {productVariantId} = req.body;
            const productVariantDesabled= await ProductVariant.update({ enabled: false}, {
                where: {
                    productVariantId
                }
            });

            return res.json({
                code: productVariantDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 