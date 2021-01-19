const MaterialStockRecord = require('../models/MaterialStockRecord');  

const MaterialStock = require('../models/MaterialStock');
const Material = require('../models/Material');
const Warehouse = require('../models/Warehouse');
const Provider = require('../models/Provider');
const Unit = require('../models/Unit');
const ModificationType = require('../models/ModificationType');

const Pagination = require('../helpers/pagination');
const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');
const { Sequelize, Op } = require("sequelize");

module.exports = class MaterialStockRecordContoller {

    async getById(req, res, next) {
        try{
            const {materialStockRecordId} = req.body;
            const materialStockRecord = await MaterialStockRecord.findOne({
                where: {
                    materialStockRecordId
                },
                include: [
                    ModificationType,
                    {
                        model: MaterialStock,
                        include: [ Material, Warehouse,Provider,Unit]
                    }
                ]
              })

            return res.json({
                code: 200,
                object: materialStockRecord
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
            const materialStockRecords = await MaterialStockRecord.findAll({
                include: [
                    ModificationType,
                    {
                        model: MaterialStock,
                        include: [ Material, Warehouse,Provider,Unit]
                    }
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: materialStockRecords
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
            const materialStockRecords = await MaterialStockRecord.findAndCountAll({
                include: [
                    ModificationType,
                    {
                        model: MaterialStock,
                        include: [ Material, Warehouse,Provider,Unit]
                    }
                ],
                order: [['createdAt','DESC']], 
                limit,
                offset
            });

            const response = Pagination.getPagingData(materialStockRecords,page,limit);

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
    
    async getbyWarehousePagination(req, res) {
        try{
            const {page, size, warehouseId} = req.body;
            const {limit , offset} =Pagination.getPagination(page, size);
            const materialStockRecords = await MaterialStockRecord.findAndCountAll({
                include: [
                    ModificationType,
                    {
                        model: MaterialStock,
                        where:{
                            warehouseId
                        },
                        include: [ Material, Warehouse,Provider,Unit]
                    }
                ],
                order: [['createdAt','DESC']], 
                limit,
                offset
            });

            const response = Pagination.getPagingData(materialStockRecords,page,limit);

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

    async getMaterialKardex(req, res) {
        try{
            let {firstDay, endDay} = req.body;

            if(firstDay === null || firstDay === undefined || endDay === null || endDay === undefined){
                let date = new Date();
                firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);    
            }

            const groupingInputs = await MaterialStockRecord.findAll({                
                attributes: [
                    'materialStockRecordId',
                    'materialStockId',
                    [Sequelize.fn('sum', Sequelize.col('modificationQuantity')), 'inputs'],
                ],
                where: {
                    createdAt: {
                        [Op.gte]: firstDay,                             // >= 6
                        [Op.lte]: endDay
                    },
                    modificationTypeId: {
                        [Op.in]: [
                            //ModificationTypeEnum.saldoInicial,
                            ModificationTypeEnum.compra,
                            ModificationTypeEnum.traslado_ingreso
                        ] 
                    }
                },
                group: 'materialStockId'
            });

            let inputList = [];
            groupingInputs.forEach(element => {
                inputList.push(element.dataValues);
            });

            const groupingOutputs = await MaterialStockRecord.findAll({
                attributes: [
                    'materialStockRecordId',
                    'materialStockId',
                    [Sequelize.fn('sum', Sequelize.col('modificationQuantity')), 'outputs'],
                ],
                where: {
                    createdAt: {
                        [Op.gte]: firstDay,                             // >= 6
                        [Op.lte]: endDay
                    },
                    modificationTypeId: {
                        [Op.in]: [
                            ModificationTypeEnum.ajuste,
                            ModificationTypeEnum.venta,
                            ModificationTypeEnum.traslado_salida
                        ] 
                    }
                },
                group: 'materialStockId'
            });

            let outputList = [];
            groupingOutputs.forEach(element => {
                outputList.push(element.dataValues);
            });

            const initialBalanceQuery = await MaterialStockRecord.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: firstDay,                             // >= 6
                        [Op.lte]: endDay
                    }
                },
                include: [
                    ModificationType,
                    {
                        model: MaterialStock,
                        include: [ Material, Warehouse,Provider,Unit]
                    }
                ],
                order: [
                    ['materialStockId']
                ]
            });

            let initialBalanceBase = [];
            initialBalanceQuery.forEach(element => {
                initialBalanceBase.push(element.dataValues);
            });

            let initialBalanceList = [];
            let stockId = 0;
            initialBalanceBase.forEach(x => {
                if(x.materialStockId === stockId){                    
                    return;
                }
                stockId = x.materialStockId;
                initialBalanceList.push({warehouseName: x.MaterialStock.Warehouse.warehouseName,warehouseId: x.MaterialStock.warehouseId, materialStockRecordId: x.materialStockRecordId,materialStockId: x.materialStockId, materialUnit: x.MaterialStock.Unit.unitName, materialProvider: x.MaterialStock.Provider.providerNames+" "+x.MaterialStock.Provider.providerSurnames, materialName:x.MaterialStock.Material.materialName, initialBalance:x.materialBalance});                
            });

            const currentBalanceQuery = await MaterialStockRecord.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: firstDay,                             // >= 6
                        [Op.lte]: endDay
                    }
                },
                include: [
                    ModificationType,
                    {
                        model: MaterialStock,
                        include: [ Material, Warehouse,Provider,Unit]
                    }
                ],
                order: [
                    ['materialStockId'],
                    ['createdAt','DESC']
                ]
            });

            let currentBalanceBase = [];
            currentBalanceQuery.forEach(element => {
                currentBalanceBase.push(element.dataValues);
            });

            let currentBalanceList = [];
            stockId = 0;
            currentBalanceBase.forEach(x => {
                if(x.materialStockId === stockId){                    
                    return;
                }
                stockId = x.materialStockId;
                currentBalanceList.push({materialStockRecordId: x.materialStockRecordId,materialStockId: x.materialStockId, materialName:x.MaterialStock.Material.materialName, currentBalance:x.materialBalance});                
            });

            const rows = initialBalanceList.length;
            // console.table({rows})
            // initialBalanceList
            // currentBalanceList
            let kardexTmp = [];
            for(let i=0; i<rows; i++){
                kardexTmp.push({
                    ...initialBalanceList[i],
                    currentBalance: currentBalanceList[i].currentBalance
                });
            } 
 
            for (let i in kardexTmp) {
                for (let y in inputList) {
                     if(kardexTmp[i].materialStockId === inputList[y].materialStockId){
                        kardexTmp[i].inputs = inputList[y].inputs 
                     }
                }
            }
            let kardex = kardexTmp;

            for (let i in kardex) {
                if(kardex[i].inputs === undefined){
                    kardex[i].inputs =0;
                }
            } 

            for (let i in kardex) {
                for (let y in outputList) {
                     if(kardex[i].materialStockId === outputList[y].materialStockId){
                         kardex[i].outputs = outputList[y].outputs;
                     }
                }
            } 

            for (let i in kardex) {
                if(kardex[i].outputs === undefined){
                    kardex[i].outputs =0;
                }
            }

            console.log(firstDay + ' ' + endDay)

            return res.json({code: 200, kardex}); 
          

        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }
}
 

 