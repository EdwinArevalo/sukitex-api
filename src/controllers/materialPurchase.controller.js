const MaterialPurchase = require('../models/MaterialPurchase');
const MaterialPurchaseDetail = require('../models/MaterialPurchaseDetail');
const MaterialStockRecord = require('../models/MaterialStockRecord');
const MaterialStock = require('../models/MaterialStock');
const Material = require('../models/Material');
const Warehouse = require('../models/Warehouse');

const Provider = require('../models/Provider');
const User = require('../models/User');

const Unit = require('../models/Unit');
const Pagination = require('../helpers/pagination');

const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class MaterialPurchaseContoller {

    async getById(req, res, next) {
        try{
            const {materialPurchaseId} = req.body;
            const materialPurchase = await MaterialPurchase.findOne({
                where: {
                    materialPurchaseId
                },
                include: [
                    {
                        model: MaterialPurchaseDetail,
                        include: [{
                            model: MaterialStock,
                            include: [ 
                                Unit,
                                Material,
                                Warehouse
                            ]
                        }]
                    },
                    Provider,
                    User  
                ]
              })

            return res.json({
                code: 200,
                object: materialPurchase
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
            const materialPurchases = await MaterialPurchase.findAll({
                include: [
                    {
                        model: MaterialPurchaseDetail,
                        include: [{
                            model: MaterialStock,
                            include: [ 
                                Unit,
                                Material,
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
                list: materialPurchases
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
            const materialPurchases = await MaterialPurchase.findAndCountAll({
                include: [
                    {
                        model: MaterialPurchaseDetail,
                        include: [{
                            model: MaterialStock,
                            include: [ 
                                Unit,
                                Material,
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

            const response = Pagination.getPagingData(materialPurchases,page,limit);

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
            const {userId, providerId, materials} = req.body;
            // warehouseId, unitId, materialId, materialQuantity, detailTotal

            const newMaterialPurchase =  await MaterialPurchase.create({
                userId, 
                providerId
            }); 

            await materials.forEach(async m => {
                const materialStockExist = await MaterialStock.findOne({
                    where: {
                        materialId: m.materialId,
                        warehouseId: m.warehouseId,
                        unitId: m.unitId
                    }
                }); 
                
                if(materialStockExist == null){
                    const newMaterialStock =  await MaterialStock.create({
                        warehouseId: m.warehouseId,
                        materialId: m.materialId, 
                        unitId: m.unitId,
                        providerId, 
                        materialQuantity: m.materialQuantity
                    });
        
                    const newMaterialStockRecord = await MaterialStockRecord.create({
                        materialStockId: newMaterialStock.materialStockId,
                        materialBalance: m.materialQuantity,
                        modificationTypeId: ModificationTypeEnum.compra,
                        modificationQuantity: m.materialQuantity                
                    }); 
    
                    // const newMaterialPurchaseDetail = await MaterialPurchaseDetail.create({
                    await MaterialPurchaseDetail.create({
                        materialPurchaseId: newMaterialPurchase.materialPurchaseId,
                        materialStockId: newMaterialStock.materialStockId,
                        materialQuantity: m.materialQuantity,
                        detailTotal: m.detailTotal,
                        materialStockRecordId: newMaterialStockRecord.materialStockRecordId
                    }); 
    
                }else {
                    const materialStockExist = await MaterialStock.findOne({
                        where: {
                            materialId: m.materialId,
                            warehouseId: m.warehouseId,
                            unitId: m.unitId
                        }
                    }); 
                    const oldMaterialStockRecord = await MaterialStockRecord.findOne({
                        where:{
                            materialStockId: materialStockExist.materialStockId
                        },
                        order: [
                            ['createdAt','DESC']
                        ]
                    }); 
                    // if (oldMaterialStockRecord == null){
                    //     return res.status(400).json({
                    //         code: 0,
                    //         msg: 'No se encontró un balance anterior del material indicado!'
                    //     });
                    // } 
                    await MaterialStock.update({ materialQuantity: (materialStockExist.materialQuantity + m.materialQuantity), updatedAt: new Date()}, {
                        where: {
                            materialStockId: materialStockExist.materialStockId
                        }
                    });
        
                    const newMaterialStockRecord = await MaterialStockRecord.create({
                        materialStockId: materialStockExist.materialStockId,
                        materialBalance: (oldMaterialStockRecord.materialBalance + m.materialQuantity),
                        modificationTypeId: ModificationTypeEnum.compra,
                        modificationQuantity: m.materialQuantity                
                    }); 
        
                    // const newMaterialPurchaseDetail = await MaterialPurchaseDetail.create({
                    await MaterialPurchaseDetail.create({
                        materialPurchaseId: newMaterialPurchase.materialPurchaseId,
                        materialStockId: materialStockExist.materialStockId,
                        materialQuantity: m.materialQuantity,
                        detailTotal: m.detailTotal,
                        materialStockRecordId: newMaterialStockRecord.materialStockRecordId
                    });      
                }
            }); 
                  
            return res.json({
                code: 200,
                newMaterialPurchase
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
    //         const {materialPurchaseId, unitId, materialQuantity} = req.body;
    //         const materialPurchaseUpdated = await MaterialPurchase.update({ unitId, materialQuantity, updatedAt: new Date()}, {
    //             where: {
    //                 materialPurchaseId
    //             }
    //         });

    //         return res.json({
    //             code: materialPurchaseUpdated[0]
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
    //         const {materialPurchaseId} = req.body;
    //         const materialPurchaseDesabled= await MaterialPurchase.update({ enabled: false}, {
    //             where: {
    //                 materialPurchaseId
    //             }
    //         });

    //         return res.json({
    //             code: materialPurchaseDesabled[0]
    //         });
        
    //     }catch(err) {
    //         return res.status(400).json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }
}
 

 