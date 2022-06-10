const MaterialStock = require('../models/MaterialStock');
const MaterialStockRecord = require('../models/MaterialStockRecord');
const Unit = require('../models/Unit');
const Material = require('../models/Material');
const Warehouse = require('../models/Warehouse');
const Provider = require('../models/Provider');

const Address = require('../models/Address');
const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

const Pagination = require('../helpers/pagination');
const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class MaterialStockContoller {

    async getById(req, res, next) {
        try{
            const {materialStockId} = req.body;
            const materialStock = await MaterialStock.findOne({
                where: {
                    materialStockId
                },
                include: [
                    Unit,
                    Material,
                    {
                        model: Warehouse,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    },                    
                    {
                        model: Provider,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    }
                ]
              })

            return res.json({
                code: 200,
                object: materialStock
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        }
        
    }

    async getByWarehouse(req, res, next) {
        try{
            const {warehouseId} = req.body;
            const materialStock = await MaterialStock.findAll({
                where: {
                    warehouseId
                },
                include: [
                    Unit,
                    Material,
                    {
                        model: Warehouse,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    },                    
                    {
                        model: Provider,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    }
                ],
                order: [['createdAt','DESC']]
              })

            return res.json({
                code: 200,
                object: materialStock
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
            const materialsStock = await MaterialStock.findAll({
                include: [
                    Unit,
                    Material,
                    {
                        model: Warehouse,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    },                    
                    {
                        model: Provider,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    }
                ],
                order: [['createdAt','DESC']]              
            });
            return res.json({
                code: 200,
                list: materialsStock
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
            const materialsStock = await MaterialStock.findAndCountAll({
                include: [
                    Unit,
                    Material,
                    {
                        model: Warehouse,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    },                    
                    {
                        model: Provider,
                        include: [ {
                            model: Address,
                            include: [Department, District,Via]
                        }]
                    }
                ],
                order: [['createdAt','DESC']],
                limit,
                offset            
            });

            const response = Pagination.getPagingData(materialsStock,page,limit);

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
            const {warehouseId, materialId, unitId, providerId, materialQuantity } = req.body;
            const materialStockExist = await MaterialStock.findOne({
                where: {
                    materialId,
                    warehouseId
                }
            });
            
            if(materialStockExist != null) {
                return res.status(200).json({
                    code: 0,
                    msg: 'El material que intenta registrar ya se encuentra en el almacen indicado!',
                });
            }

            const newMaterialStock =  await MaterialStock.create({
                warehouseId,
                materialId, 
                unitId, 
                providerId, 
                materialQuantity
            });


            const newMaterialStockRecord = await MaterialStockRecord.create({
                materialStockId: newMaterialStock.materialStockId,
                materialBalance: materialQuantity,
                modificationTypeId: ModificationTypeEnum.saldoInicial,
                modificationQuantity: materialQuantity                
            });

            return res.json({
                code: 200,
                object: newMaterialStock,
                newMaterialStockRecord
            });
        
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
            const {materialStockId, unitId} = req.body;
            const materialStockUpdated = await MaterialStock.update({ unitId, updatedAt: new Date()}, {
                where: {
                    materialStockId
                }
            });

            return res.json({
                code: materialStockUpdated[0]
            });
        
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
            const {materialStockId} = req.body;
            const materialStockDesabled= await MaterialStock.update({ enabled: false}, {
                where: {
                    materialStockId
                }
            });

            return res.json({
                code: materialStockDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 