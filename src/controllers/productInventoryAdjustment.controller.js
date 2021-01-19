const ProductInventoryAdjustment = require('../models/ProductInventoryAdjustment');
const ProductStockRecord = require('../models/ProductStockRecord');
const ProductStock = require('../models/ProductStock');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductVariant = require('../models/ProductVariant');
const Warehouse = require('../models/Warehouse');
const Size = require('../models/Size');
const Color = require('../models/Color');

const User = require('../models/User');
const AdjustmentReason = require('../models/AdjustmentReason');

const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class ProductInventoryAdjustmentContoller {

    async getById(req, res, next) {
        try{
            const {inventoryAdjustmentId} = req.body;
            const productInventoryAdjustment = await ProductInventoryAdjustment.findOne({
                where: {
                    inventoryAdjustmentId
                },
                include: [
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
                    },  
                    AdjustmentReason,       
                    User
                ]
            });

            return res.json({
                code: 200,
                object: productInventoryAdjustment
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
            const productInventoryAdjustments = await ProductInventoryAdjustment.findAll({
                include: [
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
                    },  
                    AdjustmentReason,       
                    User
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: productInventoryAdjustments
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
            const productInventoryAdjustments = await ProductInventoryAdjustment.findAndCountAll({
                include: [
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
                    },  
                    AdjustmentReason,       
                    User
                ],
                order: [['createdAt','DESC']],
                limit,
                offset            
            });

            const response = Pagination.getPagingData(productInventoryAdjustments,page,limit);

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
            const {userId, adjustmentReasonId, warehouseId, productVariantId, productQuantity} = req.body;

            const productStockExist = await ProductStock.findOne({
                where: {
                    productVariantId,
                    warehouseId
                }
            }); 

            if(productStockExist == null){
                return res.json({
                    code: 0,
                    msg: 'No se encontraron existencias registradas de este producto!',
                });
            } 

            const oldProductStockRecord = await ProductStockRecord.findOne({
                where:{
                    productStockId: productStockExist.productStockId
                },
                order: [
                    ['createdAt','DESC']
                ]
            });

            if (oldProductStockRecord == null){
                return res.status(400).json({
                    code: 0,
                    msg: 'No se encontró un balance anterior de la variante del producto indicado!'
                });
            }

            if(productStockExist.productQuantity < productQuantity){
                return res.json({
                    code: 0,
                    msg: 'Existencias insuficientes!'
                });
            }

            if (oldProductStockRecord.productBalance < productQuantity){
                return res.status(400).json({
                    code: 0,
                    msg: 'Balance de la variante del producto indicado inecxacto!'
                });
            }

            await ProductStock.update({ productQuantity: (productStockExist.productQuantity - productQuantity), updatedAt: new Date()}, {
                where: {
                    productStockId: productStockExist.productStockId
                }
            });

            const newProductStockRecord = await ProductStockRecord.create({
                productStockId: productStockExist.productStockId,
                productBalance: (oldProductStockRecord.productBalance - productQuantity),
                modificationTypeId: ModificationTypeEnum.ajuste,
                modificationQuantity: productQuantity      
            });

            const newProductInventoryAdjustment =  await ProductInventoryAdjustment.create({
                userId, 
                productStockId: productStockExist.productStockId,
                productQuantity,
                adjustmentReasonId,
                productStockRecordId: newProductStockRecord.productStockRecordId
            });  

            return res.json({
                code: 200,
                object: {
                    newProductStockRecord,
                    newProductInventoryAdjustment
                }
            });
        
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
 

 