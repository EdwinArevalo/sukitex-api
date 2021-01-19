const ProductTransfer = require('../models/ProductTransfer');
const ProductStockRecord = require('../models/ProductStockRecord');
const ProductStock = require('../models/ProductStock');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductVariant = require('../models/ProductVariant');
const Warehouse = require('../models/Warehouse');
const Size = require('../models/Size');
const Color = require('../models/Color');

const User = require('../models/User');

const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class ProductTransferContoller {

    async getById(req, res, next) {
        try{
            const {productTransferId} = req.body;
            const productTransfer = await ProductTransfer.findOne({
                where: {
                    productTransferId
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
                            Warehouse,                            
                        ]
                    },
                    {
                        model: Warehouse,
                        as: 'originWarehouse'
                    },
                    {
                        model: Warehouse,
                        as: 'destinationWarehouse'
                    },
                    User
                ]
              })

            return res.json({
                code: 200,
                object: productTransfer
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
            const productTransfers = await ProductTransfer.findAll({
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
                            Warehouse,                            
                        ]
                    },
                    {
                        model: Warehouse,
                        as: 'originWarehouse'
                    },
                    {
                        model: Warehouse,
                        as: 'destinationWarehouse'
                    },
                    User
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,     
                list: productTransfers
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
            const productTransfers = await ProductTransfer.findAndCountAll({
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
                            Warehouse,                            
                        ]
                    },
                    {
                        model: Warehouse,
                        as: 'originWarehouse'
                    },
                    {
                        model: Warehouse,
                        as: 'destinationWarehouse'
                    },
                    User
                ],
                order: [['createdAt','DESC']],
                limit,
                offset            
            });

            const response = Pagination.getPagingData(productTransfers,page,limit);

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
            const {
                productQuantity,
                productVariantId,
                originWarehouseId,
                destinationWarehouseId,
                userId,
            } = req.body; 

            const productStockExist = await ProductStock.findOne({
                where: {
                    productVariantId,
                    warehouseId: originWarehouseId
                }
            }); 

            if(productStockExist == null){
                return res.json({
                    code: 0,
                    msg: 'No se encontraron existencias registradas de este producto de origen!',
                });
            } 

            const oldProductStockRecordDeparture = await ProductStockRecord.findOne({
                where:{
                    productStockId: productStockExist.productStockId
                },
                order: [
                    ['createdAt','DESC']
                ]
            });

            if (oldProductStockRecordDeparture == null){
                return res.status(400).json({
                    code: 0,
                    msg: 'No se encontró un balance anterior de la variante del producto de origen!'
                });
            }

            if(productStockExist.productQuantity < productQuantity){
                return res.json({
                    code: 0,
                    msg: 'Existencias insuficientes!'
                });
            }

            if (oldProductStockRecordDeparture.productBalance < productQuantity){
                return res.status(400).json({
                    code: 0,
                    msg: 'Balance de la variante del producto indicado inecxacto!'
                });
            }

            const productStockReceptor = await ProductStock.findOne({
                where: {
                    productVariantId,
                    warehouseId: destinationWarehouseId
                }
            });

            if(productStockReceptor == null){

                //AÑADIMOS
                const newProductStockReceptor =  await ProductStock.create({
                    warehouseId: destinationWarehouseId,
                    productVariantId, 
                    productQuantity
                });
    
                const newProductStockRecordEntry = await ProductStockRecord.create({
                    productStockId: newProductStockReceptor.productStockId,
                    productBalance: productQuantity,
                    modificationTypeId: ModificationTypeEnum.traslado_ingreso,
                    modificationQuantity: productQuantity                
                });

                //QUITAMOS
                await ProductStock.update({ productQuantity: (productStockExist.productQuantity - productQuantity), updatedAt: new Date()}, {
                    where: {
                        productStockId: productStockExist.productStockId
                    }
                });
    
                const newProductStockRecordDeparture = await ProductStockRecord.create({
                    productStockId: productStockExist.productStockId,
                    productBalance: (oldProductStockRecordDeparture.productBalance - productQuantity),
                    modificationTypeId: ModificationTypeEnum.traslado_salida,
                    modificationQuantity: productQuantity                
                });
    
                //REGISTRAMOS LA TRANSFERENCIA
                const newProductTransfer = await ProductTransfer.create({
                    productStockId: productStockExist.productStockId,
                    originWarehouseId,
                    destinationWarehouseId,
                    productQuantity,
                    productStockRecordId: newProductStockRecordEntry.productStockRecordId,
                    userId
                })
    
                return res.json({
                    code: 200,
                    object: {
                        newProductTransfer,
                        newProductStockRecordEntry,
                        newProductStockRecordDeparture
                    }
                });

            }else {
                const oldProductStockRecordEntry = await ProductStockRecord.findOne({
                    where:{
                        productStockId: productStockReceptor.productStockId
                    },
                    order: [
                        ['createdAt','DESC']
                    ]
                });
    
                if (oldProductStockRecordEntry == null){
                    return res.status(400).json({
                        code: 0,
                        msg: 'No se encontró un balance anterior de la variante del producto de destino!'
                    });
                }
    
                //AÑADIMOS 
                await ProductStock.update({ productQuantity: (productStockReceptor.productQuantity + productQuantity), updatedAt: new Date()}, {
                    where: {
                        productStockId: productStockReceptor.productStockId
                    }
                });
    
                const newProductStockRecordEntry = await ProductStockRecord.create({
                    productStockId: productStockReceptor.productStockId,
                    productBalance: (oldProductStockRecordEntry.productBalance + productQuantity),
                    modificationTypeId: ModificationTypeEnum.traslado_ingreso,
                    modificationQuantity: productQuantity                
                });
    
                //QUITAMOS
                await ProductStock.update({ productQuantity: (productStockExist.productQuantity - productQuantity), updatedAt: new Date()}, {
                    where: {
                        productStockId: productStockExist.productStockId
                    }
                });
    
                const newProductStockRecordDeparture = await ProductStockRecord.create({
                    productStockId: productStockExist.productStockId,
                    productBalance: (oldProductStockRecordDeparture.productBalance - productQuantity),
                    modificationTypeId: ModificationTypeEnum.traslado_salida,
                    modificationQuantity: productQuantity                
                });
    
                //REGISTRAMOS LA TRANSFERENCIA
                const newProductTransfer = await ProductTransfer.create({
                    productStockId: productStockExist.productStockId,
                    originWarehouseId,
                    destinationWarehouseId,
                    productQuantity,
                    productStockRecordId: newProductStockRecordEntry.productStockRecordId,
                    userId
                })
    
                return res.json({
                    code: 200,
                    object: {
                        newProductTransfer,
                        newProductStockRecordEntry,
                        newProductStockRecordDeparture
                    }
                });
            }
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        }   
    }


    // async delete(req, res){
    //     try{
    //         const {ProductTransferId} = req.body;
    //         const ProductTransferDesabled= await ProductTransfer.update({ enabled: false}, {
    //             where: {
    //                 ProductTransferId
    //             }
    //         });
    //         return res.json({
    //             code: ProductTransferDesabled[0]
    //         });
        
    //     }catch(err) {
    //         return res.json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }
}



 