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
            const {productPurchaseId} = req.body;
            const productPurchase = await ProductPurchase.findOne({
                where: {
                    productPurchaseId
                },
                include: [
                    {
                        model: ProductPurchaseDetail,
                        include: [{
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
                        }]
                    },
                    Provider,
                    User                                     
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
            const productPurchases = await ProductPurchase.findAll({
                include: [
                    {
                        model: ProductPurchaseDetail,
                        include: [{
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
                        }]
                    },
                    Provider,
                    User                                     
                ],
                order: [['createdAt','DESC']]
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
            const productPurchases = await ProductPurchase.findAndCountAll({
                include: [
                    {
                        model: ProductPurchaseDetail,
                        include: [{
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
                        }]
                    },
                    Provider,
                    User                                     
                ],
                order: [['createdAt','DESC']],
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
            const {userId, providerId, products} = req.body;
            //warehouseId, productVariantId, productQuantity, detailTotal

            const newProductPurchase =  await ProductPurchase.create({
                userId, 
                providerId
            }); 

            await products.forEach(async p => {
                const productStockExist = await ProductStock.findOne({
                    where: {
                        productVariantId: p.productVariantId,
                        warehouseId: p.warehouseId
                    }
                }); 
                
                if(productStockExist == null){
    
                    const newProductStock =  await ProductStock.create({
                        warehouseId: p.warehouseId,
                        productVariantId: p.productVariantId, 
                        productQuantity: p.productQuantity
                    });
        
                    const newProductStockRecord = await ProductStockRecord.create({
                        productStockId: newProductStock.productStockId,
                        productBalance: p.productQuantity,
                        modificationTypeId: ModificationTypeEnum.compra,
                        modificationQuantity: p.productQuantity                
                    }); 
    
                    // const newProductPurchaseDetail = await ProductPurchaseDetail.create({
                    await ProductPurchaseDetail.create({
                        productPurchaseId: newProductPurchase.productPurchaseId,
                        productStockId: newProductStock.productStockId,
                        productQuantity: p.productQuantity,
                        detailTotal: p.detailTotal,
                        productStockRecordId: newProductStockRecord.productStockRecordId
                    }); 
    
                }else {
                    const productStockExist = await ProductStock.findOne({
                        where: {
                            productVariantId: p.productVariantId,
                            warehouseId: p.warehouseId
                        }
                    }); 

                    const oldProductStockRecord = await ProductStockRecord.findOne({
                        where:{
                            productStockId: productStockExist.productStockId
                        },
                        order: [
                            ['createdAt','DESC']
                        ]
                    });
                    // if (oldProductStockRecord == null){
    
                    //     return res.status(400).json({
                    //         code: 0,
                    //         msg: 'No se encontró un balance anterior de la variante del producto indicado!'
                    //     });
                    // }
                    await ProductStock.update({ productQuantity: (productStockExist.productQuantity + p.productQuantity), updatedAt: new Date()}, {
                        where: {
                            productStockId: productStockExist.productStockId
                        }
                    });
        
                    const newProductStockRecord = await ProductStockRecord.create({
                        productStockId: productStockExist.productStockId,
                        productBalance: (oldProductStockRecord.productBalance + p.productQuantity),
                        modificationTypeId: ModificationTypeEnum.compra,
                        modificationQuantity: p.productQuantity                
                    }); 
        
                    // const newProductPurchaseDetail = await ProductPurchaseDetail.create({
                    await ProductPurchaseDetail.create({
                        productPurchaseId: newProductPurchase.productPurchaseId,
                        productStockId: productStockExist.productStockId,
                        productQuantity: p.productQuantity,
                        detailTotal: p.detailTotal,
                        productStockRecordId: newProductStockRecord.productStockRecordId
                    });    
                }
            });       

            return res.json({
                code: 200,
                newProductPurchase
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
 

 