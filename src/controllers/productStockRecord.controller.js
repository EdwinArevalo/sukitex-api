const ProductStockRecord = require('../models/ProductStockRecord');  

const ProductStock = require('../models/ProductStock');
const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Size = require('../models/Size');
const Color = require('../models/Color');
const ModificationType = require('../models/ModificationType');

const Pagination = require('../helpers/pagination');
const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');
const { Sequelize, Op } = require("sequelize");
module.exports = class ProductStockRecordContoller {

    async getById(req, res, next) {
        try{
            const {productStockRecordId} = req.body;
            const productStockRecord = await ProductStockRecord.findOne({
                where: {
                    productStockRecordId
                },
                include: [
                    ModificationType,
                    {
                        model: ProductStock,
                        include: [{
                            model: ProductVariant,
                            include: [Product,Size,Color]
                        },
                        Warehouse ]
                    }
                ]
              })

            return res.json({
                code: 200,
                object: productStockRecord
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
            const productStockRecords = await ProductStockRecord.findAll({
                include: [
                    ModificationType,
                    {
                        model: ProductStock,
                        include: [{
                            model: ProductVariant,
                            include: [Product,Size,Color]
                        },
                        Warehouse ]
                    }
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: productStockRecords
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
            const productStockRecords = await ProductStockRecord.findAndCountAll({
                include: [
                    ModificationType,
                    {
                        model: ProductStock,
                        include: [{
                            model: ProductVariant,
                            include: [Product,Size,Color]
                        },
                        Warehouse ]
                    }
                ],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(productStockRecords,page,limit);

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
            const productStockRecords = await ProductStockRecord.findAndCountAll({
                include: [
                    ModificationType,
                    {
                        model: ProductStock,
                        where: {
                            warehouseId 
                        },
                        include: [{
                            model: ProductVariant,
                            include: [Product,Size,Color]
                        },
                        Warehouse ]
                    }
                ],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(productStockRecords,page,limit);

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

    async getProductKardex(req, res) {
        try{
            let {firstDay, endDay} = req.body;

            if(firstDay === null || firstDay === undefined || endDay === null || endDay === undefined){
                let date = new Date();
                firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);    
            }

            const groupingInputs = await ProductStockRecord.findAll({                
                attributes: [
                    'productStockRecordId',
                    'productStockId',
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
                group: 'productStockId'
            });

            let inputList = [];
            groupingInputs.forEach(element => {
                inputList.push(element.dataValues);
            });

            const groupingOutputs = await ProductStockRecord.findAll({
                attributes: [
                    'productStockRecordId',
                    'productStockId',
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
                group: 'productStockId'
            });

            let outputList = [];
            groupingOutputs.forEach(element => {
                outputList.push(element.dataValues);
            });

            const initialBalanceQuery = await ProductStockRecord.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: firstDay,                             // >= 6
                        [Op.lte]: endDay
                    }
                },
                include: [
                    ModificationType,
                    {
                        model: ProductStock,
                        include: [{
                            model: ProductVariant,
                            include: [Product,Size,Color]
                        },
                        Warehouse ]
                    }
                ],
                order: [
                    ['productStockId']
                ]
            });

            let initialBalanceBase = [];
            initialBalanceQuery.forEach(element => {
                initialBalanceBase.push(element.dataValues);
            });

            let initialBalanceList = [];
            let stockId = 0;
            initialBalanceBase.forEach(x => {
                if(x.productStockId === stockId){                    
                    return;
                }
                stockId = x.productStockId;
                initialBalanceList.push({warehouseName: x.ProductStock.Warehouse.warehouseName,warehouseId: x.ProductStock.warehouseId, productStockRecordId: x.productStockRecordId,productStockId: x.productStockId, productSize: x.ProductStock.ProductVariant.Size.sizeName ,productColor:  x.ProductStock.ProductVariant.Color.colorName , productName:x.ProductStock.ProductVariant.Product.productName, initialBalance:x.productBalance});                
            });

            const currentBalanceQuery = await ProductStockRecord.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: firstDay,                             // >= 6
                        [Op.lte]: endDay
                    }
                },
                include: [
                    ModificationType,
                    {
                        model: ProductStock,
                        include: [{
                            model: ProductVariant,
                            include: [Product,Size,Color]
                        },
                        Warehouse ]
                    }
                ],
                order: [
                    ['productStockId'],
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
                if(x.productStockId === stockId){                    
                    return;
                }
                stockId = x.productStockId;
                currentBalanceList.push({productStockRecordId: x.productStockRecordId,productStockId: x.productStockId, productName:x.ProductStock.ProductVariant.Product.productName, currentBalance:x.productBalance});                
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
                     if(kardexTmp[i].productStockId === inputList[y].productStockId){
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
                     if(kardex[i].productStockId === outputList[y].productStockId){
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
 

 