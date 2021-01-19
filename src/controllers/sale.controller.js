const Sale = require('../models/Sale');
const SaleDetail = require('../models/SaleDetail');
const ProductStockRecord = require('../models/ProductStockRecord');
const ProductStock = require('../models/ProductStock');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductVariant = require('../models/ProductVariant');
const Warehouse = require('../models/Warehouse');
const Size = require('../models/Size');
const Color = require('../models/Color');

const Client = require('../models/Client');
const User = require('../models/User');

const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class SaleContoller {

    async getById(req, res, next) {
        try{
            const {saleId} = req.body;
            const sale = await Sale.findOne({
                where: {
                    saleId
                },
                include: [
                    {
                        model: SaleDetail,
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
                            } 
                        ]
                    },
                    Client,
                    User                                   
                ]
            });

            return res.json({
                code: 200,
                object: sale
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
            const saleDetails = await Sale.findAll({
                include: [
                    {
                        model: SaleDetail,
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
                            } 
                        ]
                    },
                    Client,
                    User                                   
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: saleDetails
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
            const saleDetails = await Sale.findAndCountAll({
                include: [
                    {
                        model: SaleDetail,
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
                            } 
                        ]
                    },
                    Client,
                    User                                   
                ],
                order: [['createdAt','DESC']],
                limit,
                offset            
            });

            const response = Pagination.getPagingData(saleDetails,page,limit);

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
          
    async insert(req, res, next) {
        try{
            const {userId, clientId,products} = req.body;
            
            //productQuantity, productVariantId, warehouseId  
            const newSale =  await Sale.create({
                userId, 
                clientId
            });    
            await products.forEach(async p => {
                const productStockExist = await ProductStock.findOne({
                    where: {
                        productVariantId: p.productVariantId,
                        warehouseId: p.warehouseId
                    }
                }); 

                await ProductStock.update({ productQuantity: (productStockExist.productQuantity - p.productQuantity), updatedAt: new Date()}, {
                    where: {
                        productStockId: productStockExist.productStockId
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
    
                const newProductStockRecord = await ProductStockRecord.create({
                    productStockId: productStockExist.productStockId,
                    productBalance: (oldProductStockRecord.productBalance - p.productQuantity),
                    modificationTypeId: ModificationTypeEnum.venta,
                    modificationQuantity: p.productQuantity                
                }); 
                // const newSaleDetail = await SaleDetail.create({
                await SaleDetail.create({
                    saleId: newSale.saleId,
                    productStockId: productStockExist.productStockId,
                    productQuantity: p.productQuantity,
                    saleDetailTotal: ( productStockExist.productPrice * p.productQuantity),
                    productStockRecordId: newProductStockRecord.productStockRecordId
                }); 
            });    

            return res.json({
                code: 200,
                object: { 
                    newSale
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
 

 