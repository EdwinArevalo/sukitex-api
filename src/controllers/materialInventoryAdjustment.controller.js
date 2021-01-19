const MaterialInventoryAdjustment = require('../models/MaterialInventoryAdjustment');
const MaterialStockRecord = require('../models/MaterialStockRecord');
const MaterialStock = require('../models/MaterialStock');
const Material = require('../models/Material');
const Warehouse = require('../models/Warehouse');
const Unit = require('../models/Unit');

const User = require('../models/User');
const AdjustmentReason = require('../models/AdjustmentReason');

const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class MaterialInventoryAdjustmentContoller {

    async getById(req, res, next) {
        try{
            const {inventoryAdjustmentId} = req.body;
            const materialInventoryAdjustment = await MaterialInventoryAdjustment.findOne({
                where: {
                    inventoryAdjustmentId
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
                    AdjustmentReason,       
                    User
                ]
            });

            return res.json({
                code: 200,
                object: materialInventoryAdjustment
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
            const materialInventoryAdjustments = await MaterialInventoryAdjustment.findAll({
                include: [
                    {
                        model: MaterialStock,
                        include: [ 
                            Unit,
                            Material,
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
                list: materialInventoryAdjustments
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
            const materialInventoryAdjustments = await MaterialInventoryAdjustment.findAndCountAll({
                include: [
                    {
                        model: MaterialStock,
                        include: [ 
                            Unit,
                            Material,
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

            const response = Pagination.getPagingData(materialInventoryAdjustments,page,limit);

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
            const {userId, adjustmentReasonId, warehouseId, materialId, materialQuantity} = req.body;

            const materialStockExist = await MaterialStock.findOne({
                where: {
                    materialId,
                    warehouseId
                }
            }); 

            if(materialStockExist == null){
                return res.json({
                    code: 0,
                    msg: 'No se encontraron existencias registradas de este material!',
                });
            } 

            const oldMaterialStockRecord = await MaterialStockRecord.findOne({
                where:{
                    materialStockId: materialStockExist.materialStockId
                },
                order: [
                    ['createdAt','DESC']
                ]
            });

            if (oldMaterialStockRecord == null){
                return res.status(400).json({
                    code: 0,
                    msg: 'No se encontró un balance anterior del material indicado!'
                });
            }

            if(materialStockExist.materialQuantity < materialQuantity){
                return res.json({
                    code: 0,
                    msg: 'Existencias insuficientes!'
                });
            }

            if (oldMaterialStockRecord.materialBalance < materialQuantity){
                return res.status(400).json({
                    code: 0,
                    msg: 'Balance del material indicado inecxacto!'
                });
            }

            await MaterialStock.update({ materialQuantity: (materialStockExist.materialQuantity - materialQuantity), updatedAt: new Date()}, {
                where: {
                    materialStockId: materialStockExist.materialStockId
                }
            });

            const newMaterialStockRecord = await MaterialStockRecord.create({
                materialStockId: materialStockExist.materialStockId,
                materialBalance: (oldMaterialStockRecord.materialBalance - materialQuantity),
                modificationTypeId: ModificationTypeEnum.ajuste,
                modificationQuantity: materialQuantity      
            });

            const newMaterialInventoryAdjustment =  await MaterialInventoryAdjustment.create({
                userId, 
                materialStockId: materialStockExist.materialStockId,
                materialQuantity,
                adjustmentReasonId,
                materialStockRecordId: newMaterialStockRecord.materialStockRecordId
            });

            return res.json({
                code: 200,
                object: {
                    newMaterialStockRecord,
                    newMaterialInventoryAdjustment
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
    //         const {MaterialPurchaseId, unitId, materialQuantity} = req.body;
    //         const MaterialPurchaseUpdated = await MaterialPurchase.update({ unitId, materialQuantity, updatedAt: new Date()}, {
    //             where: {
    //                 MaterialPurchaseId
    //             }
    //         });

    //         return res.json({
    //             code: MaterialPurchaseUpdated[0]
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
    //         const {MaterialPurchaseId} = req.body;
    //         const MaterialPurchaseDesabled= await MaterialPurchase.update({ enabled: false}, {
    //             where: {
    //                 MaterialPurchaseId
    //             }
    //         });

    //         return res.json({
    //             code: MaterialPurchaseDesabled[0]
    //         });
        
    //     }catch(err) {
    //         return res.status(400).json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }
}
 

 