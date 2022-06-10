const MaterialTransfer = require('../models/MaterialTransfer');
const MaterialStockRecord = require('../models/MaterialStockRecord');
const MaterialStock = require('../models/MaterialStock');
const Material = require('../models/Material');
const Warehouse = require('../models/Warehouse');
const Unit = require('../models/Unit');

const User = require('../models/User');

const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class MaterialTransferContoller {

    async getById(req, res, next) {
        try{
            const {materialTransferId} = req.body;
            const materialTransfer = await MaterialTransfer.findOne({
                where: {
                    materialTransferId
                },
                include: [
                    {
                        model: MaterialStock,
                        include: [ 
                            Unit,
                            Material,
                            Warehouse
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
                object: materialTransfer
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
            const materialTransfers = await MaterialTransfer.findAll({
                include: [
                    {
                        model: MaterialStock,
                        include: [ 
                            Unit,
                            Material,
                            Warehouse
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
                list: materialTransfers
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
            const materialTransfers = await MaterialTransfer.findAndCountAll({
                include: [
                    {
                        model: MaterialStock,
                        include: [ 
                            Unit,
                            Material,
                            Warehouse
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

            const response = Pagination.getPagingData(materialTransfers,page,limit);

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
                materialQuantity,
                materialId,
                originWarehouseId,
                destinationWarehouseId,
                userId,
            } = req.body; 

            const materialStockExist = await MaterialStock.findOne({
                where: {
                    materialId,
                    warehouseId: originWarehouseId
                }
            }); 

            if(materialStockExist == null){
                return res.json({
                    code: 0,
                    msg: 'No se encontraron existencias registradas de este material de origen!',
                });
            } 

            const oldMaterialStockRecordDeparture = await MaterialStockRecord.findOne({
                where:{
                    materialStockId: materialStockExist.materialStockId
                },
                order: [
                    ['createdAt','DESC']
                ]
            });

            if (oldMaterialStockRecordDeparture == null){
                return res.status(200).json({
                    code: 0,
                    msg: 'No se encontró un balance anterior de este material de origen!'
                });
            }

            if(materialStockExist.materialQuantity < materialQuantity){
                return res.json({
                    code: 0,
                    msg: 'Existencias insuficientes!'
                });
            }

            if (oldMaterialStockRecordDeparture.materialBalance < materialQuantity){
                return res.status(200).json({
                    code: 0,
                    msg: 'Balance de la variante del Materialo indicado inecxacto!'
                });
            }

            const materialStockReceptor = await MaterialStock.findOne({
                where: {
                    materialId,
                    warehouseId: destinationWarehouseId
                }
            });

            if(materialStockReceptor == null){

                //AÑADIMOS
                const mewMaterialStockReceptor =  await MaterialStock.create({
                    warehouseId: destinationWarehouseId,
                    materialId, 
                    materialQuantity,
                    unitId: materialStockExist.unitId,
                    providerId: materialStockExist.providerId,
                });
    
                const newMaterialStockRecordEntry = await MaterialStockRecord.create({
                    materialStockId: mewMaterialStockReceptor.materialStockId,
                    materialBalance: materialQuantity,
                    modificationTypeId: ModificationTypeEnum.traslado_ingreso,
                    modificationQuantity: materialQuantity                
                });

                //QUITAMOS
                await MaterialStock.update({ materialQuantity: (materialStockExist.materialQuantity - materialQuantity), updatedAt: new Date()}, {
                    where: {
                        materialStockId: materialStockExist.materialStockId
                    }
                });
    
                const newMaterialStockRecordDeparture = await MaterialStockRecord.create({
                    materialStockId: materialStockExist.materialStockId,
                    materialBalance: (oldMaterialStockRecordDeparture.materialBalance - materialQuantity),
                    modificationTypeId: ModificationTypeEnum.traslado_salida,
                    modificationQuantity: materialQuantity                
                });
    
                //REGISTRAMOS LA TRANSFERENCIA
                const newMaterialTransfer = await MaterialTransfer.create({
                    materialStockId: materialStockExist.materialStockId,
                    originWarehouseId,
                    destinationWarehouseId,
                    materialQuantity,
                    materialStockRecordId: newMaterialStockRecordEntry.materialStockRecordId,
                    userId
                })
    
                return res.json({
                    code: 200,
                    object: {
                        newMaterialTransfer,
                        newMaterialStockRecordEntry,
                        newMaterialStockRecordDeparture
                    }
                });

            }else {
                const oldMaterialStockRecordEntry = await MaterialStockRecord.findOne({
                    where:{
                        materialStockId: materialStockReceptor.materialStockId
                    },
                    order: [
                        ['createdAt','DESC']
                    ]
                });
    
                if (oldMaterialStockRecordEntry == null){
                    return res.status(200).json({
                        code: 0,
                        msg: 'No se encontró un balance anterior del material de destino!'
                    });
                }
    
                //AÑADIMOS 
                await MaterialStock.update({ materialQuantity: (parseInt(materialStockReceptor.materialQuantity) + parseInt(materialQuantity)), updatedAt: new Date()}, {
                    where: {
                        materialStockId: materialStockReceptor.materialStockId
                    }
                });
    
                const newMaterialStockRecordEntry = await MaterialStockRecord.create({
                    materialStockId: materialStockReceptor.materialStockId,
                    materialBalance: (parseInt(oldMaterialStockRecordEntry.materialBalance) + parseInt(materialQuantity)),
                    modificationTypeId: ModificationTypeEnum.traslado_ingreso,
                    modificationQuantity: materialQuantity                
                });
    
                //QUITAMOS
                await MaterialStock.update({ materialQuantity: (materialStockExist.materialQuantity - materialQuantity), updatedAt: new Date()}, {
                    where: {
                        materialStockId: materialStockExist.materialStockId
                    }
                });
    
                const newMaterialStockRecordDeparture = await MaterialStockRecord.create({
                    materialStockId: materialStockExist.materialStockId,
                    materialBalance: (oldMaterialStockRecordDeparture.materialBalance - materialQuantity),
                    modificationTypeId: ModificationTypeEnum.traslado_salida,
                    modificationQuantity: materialQuantity                
                });
    
                //REGISTRAMOS LA TRANSFERENCIA
                const newMaterialTransfer = await MaterialTransfer.create({
                    materialStockId: materialStockExist.materialStockId,
                    originWarehouseId,
                    destinationWarehouseId,
                    materialQuantity,
                    materialStockRecordId: newMaterialStockRecordEntry.materialStockRecordId,
                    userId
                })
    
                return res.json({
                    code: 200,
                    object: {
                        newMaterialTransfer,
                        newMaterialStockRecordEntry,
                        newMaterialStockRecordDeparture
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
    //         const {MaterialTransferId} = req.body;
    //         const MaterialTransferDesabled= await MaterialTransfer.update({ enabled: false}, {
    //             where: {
    //                 MaterialTransferId
    //             }
    //         });
    //         return res.json({
    //             code: MaterialTransferDesabled[0]
    //         });
        
    //     }catch(err) {
    //         return res.json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }
}



 