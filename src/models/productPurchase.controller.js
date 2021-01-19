const ProductPurchase = require('../models/ProductPurchase');
const ProductPurchaseDetail = require('../models/ProductPurchaseDetail');
const ProductStockRecord = require('../models/ProductStockRecord');
const ProductStock = require('../models/ProductStock');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductVariant = require('../models/ProductVariant');
const Warehouse = require('../models/Warehouse');
const Size = require('../models/Size');
const Color = require('../models/Color');

const Provider = require('../models/Provider');
const User = require('../models/User');

const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class ProductPurchaseContoller {

    async getById(req, res, next) {
        try{
            const {productPurchaseDetailId} = req.body;
            const productPurchase = await ProductPurchaseDetail.findOne({
                where: {
                    productPurchaseDetailId
                },
                include: [
                    {
                        model: ProductPurchase,
                        include: [Provider,User]
                    },
                    {
                        model: ProductStock,                        
                        include: [
                            {
                                model: ProductVariant,
                                include: [
                                    {
                                        model: Product,
                                        include: [ProductCategory]
                                    },
                                    Size,
                                    Color
                                ]                                
                            },
                            Warehouse
                        ]
                    }                 
                ]
            });

            return res.json({
                code: 200,
                object: productPurchase
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
            const productPurchases = await ProductPurchaseDetail.findAll({
                include: [
                    {
                        model: ProductPurchase,
                        include: [Provider,User]
                    },
                    {
                        model: ProductStock,                        
                        include: [
                            {
                                model: ProductVariant,
                                include: [
                                    {
                                        model: Product,
                                        include: [ProductCategory]
                                    },
                                    Size,
                                    Color
                                ]                                
                            },
                            Warehouse
                        ]
                    }                 
                ]
            });
            return res.json({
                code: 200,
                list: productPurchases
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
            const productPurchases = await ProductPurchaseDetail.findAndCountAll({
                include: [
                    {
                        model: ProductPurchase,
                        include: [Provider,User]
                    },
                    {
                        model: ProductStock,                        
                        include: [
                            {
                                model: ProductVariant,
                                include: [
                                    {
                                        model: Product,
                                        include: [ProductCategory]
                                    },
                                    Size,
                                    Color
                                ]                                
                            },
                            Warehouse
                        ]
                    }                 
                ],
                limit,
                offset            
            });

            const response = Pagination.getPagingData(productPurchases,page,limit);

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
            const {userId, providerId, warehouseId, productVariantId, productQuantity, detailTotal} = req.body;

            const productStockExist = await ProductStock.findOne({
                where: {
                    productVariantId,
                    warehouseId
                }
            }); 
            
            if(productStockExist == null){

                const newProductStock =  await ProductStock.create({
                    warehouseId,
                    productVariantId, 
                    productQuantity
                });
    
                const newProductStockRecord = await ProductStockRecord.create({
                    productStockId: newProductStock.productStockId,
                    productBalance: productQuantity,
                    modificationTypeId: ModificationTypeEnum.compra,
                    modificationQuantity: productQuantity                
                });

                const newProductPurchase =  await ProductPurchase.create({
                    userId, 
                    providerId
                });

                const newProductPurchaseDetail = await ProductPurchaseDetail.create({
                    productPurchaseId: newProductPurchase.productPurchaseId,
                    productStockId: newProductStock.productStockId,
                    productQuantity,
                    detailTotal,
                    productStockRecordId: newProductStockRecord.productStockRecordId
                });

                return res.json({
                    code: 200,
                    object: {
                        newProductStock,
                        newProductStockRecord,
                        newProductPurchase,
                        newProductPurchaseDetail
                    }
                });

            }else {
                const oldProductStockRecord = await ProductStockRecord.findOne({
                    where:{
                        productStockId: productStockExist.productStockId
                    },
                    order: [
                        ['createdAt','DESC']
                    ]
                });
    
                await ProductStock.update({ productQuantity: (productStockExist.productQuantity + productQuantity), updatedAt: new Date()}, {
                    where: {
                        productStockId: productStockExist.productStockId
                    }
                });
    
                const newProductStockRecord = await ProductStockRecord.create({
                    productStockId: productStockExist.productStockId,
                    productBalance: (oldProductStockRecord.productBalance + productQuantity),
                    modificationTypeId: ModificationTypeEnum.compra,
                    modificationQuantity: productQuantity                
                });
    
                const newProductPurchase =  await ProductPurchase.create({
                    userId, 
                    providerId
                }); 
    
                const newProductPurchaseDetail = await ProductPurchaseDetail.create({
                    productPurchaseId: newProductPurchase.productPurchaseId,
                    productStockId: productStockExist.productStockId,
                    productQuantity,
                    detailTotal,
                    productStockRecordId: newProductStockRecord.productStockRecordId
                });     
    
                return res.json({
                    code: 200,
                    object: {
                        newProductStockRecord,
                        newProductPurchase,
                        newProductPurchaseDetail
                    }
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

    // async update(req, res){
    //     try{
    //         const {ProductPurchaseId, unitId, productQuantity} = req.body;
    //         const ProductPurchaseUpdated = await ProductPurchase.update({ unitId, productQuantity, updatedAt: new Date()}, {
    //             where: {
    //                 ProductPurchaseId
    //             }
    //         });

    //         return res.json({
    //             code: ProductPurchaseUpdated[0]
    //         });
        
    //     }catch(err) {
    //         return res.status(400).json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }

    // async delete(req, res){
    //     try{
    //         const {ProductPurchaseId} = req.body;
    //         const ProductPurchaseDesabled= await ProductPurchase.update({ enabled: false}, {
    //             where: {
    //                 ProductPurchaseId
    //             }
    //         });

    //         return res.json({
    //             code: ProductPurchaseDesabled[0]
    //         });
        
    //     }catch(err) {
    //         return res.status(400).json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }
}
 

 