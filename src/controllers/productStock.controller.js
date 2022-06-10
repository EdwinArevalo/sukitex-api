const ProductStock = require('../models/ProductStock');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductStockRecord = require('../models/ProductStockRecord');
const Warehouse = require('../models/Warehouse'); 
const ProductVariant = require('../models/ProductVariant');

const Size = require('../models/Size');
const Color = require('../models/Color');

const Pagination = require('../helpers/pagination');
const ModificationTypeEnum = require('../helpers/enums/ModificationTypeEnum');

module.exports = class ProductStockContoller {

    async getById(req, res, next) {
        try{
            const {productStockId} = req.body;
            const productStock = await ProductStock.findOne({
                where: {
                    productStockId
                },
                include:[
                    Warehouse,
                    {
                        model: ProductVariant,
                        include: [Size,Color,{
                            model: Product,
                            include: ProductCategory
                        }]
                    }
                ]
              })

            return res.json({
                code: 200,
                object: productStock
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
            const productStock = await ProductStock.findAll({
                where: {
                    warehouseId
                },
                include:[
                    Warehouse,
                    {
                        model: ProductVariant,
                        include: [Size,Color, {
                            model: Product,
                            include: ProductCategory
                        }]
                    }
                ],
                order: [['createdAt','DESC']]
              })

            return res.json({
                code: 200,
                object: productStock
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
            const productsStock = await ProductStock.findAll({
                include:[
                    Warehouse,
                    {
                        model: ProductVariant,
                        include: [Size,Color,{
                            model: Product,
                            include: ProductCategory
                        }]
                    }
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: productsStock
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
            const productsStock = await ProductStock.findAndCountAll({
                include:[
                    Warehouse,
                    {
                        model: ProductVariant,
                        include: [Size,Color,{
                            model: Product,
                            include: ProductCategory
                        }]
                    }
                ],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(productsStock,page,limit);

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
            const {warehouseId, productVariantId, productQuantity, productPrice} = req.body;
            const productStockExist = await ProductStock.findOne({
                where: {
                    productVariantId,
                    warehouseId
                }
            });
            
            if(productStockExist != null) {
                return res.status(200).json({
                    code: 0,
                    msg: 'El producto que intenta registrar ya se encuentra en el almacen indicado!',
                });
            }

            const newProdcutStock =  await ProductStock.create({
                warehouseId,
                productVariantId, 
                productQuantity,
                productPrice
            }); 

            const newProductStockRecord = await ProductStockRecord.create({
                productStockId: newProdcutStock.productStockId,
                productBalance: productQuantity,
                modificationTypeId: ModificationTypeEnum.saldoInicial,
                modificationQuantity: productQuantity                
            });

            return res.json({
                code: 200,
                object: newProdcutStock,
                newProductStockRecord
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
            const {productStockId, productPrice} = req.body;
            const productStockUpdated = await ProductStock.update({ productPrice, updatedAt: new Date()}, {
                where: {
                    productStockId
                }
            });

            return res.json({
                code: productStockUpdated[0]
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
            const {productStockId} = req.body;
            const productStockDesabled= await ProductStock.update({ enabled: false}, {
                where: {
                    productStockId
                }
            });

            return res.json({
                code: productStockDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 