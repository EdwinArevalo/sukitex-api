const Warehouse = require('../models/Warehouse');
const WarehouseType = require('../models/WarehouseType');
const Address = require('../models/Address');

const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

const AddressController = require('./address.controller');


module.exports = class WarehouseContoller {

    async getById(req, res, next) {
        try{
            const {warehouseId} = req.body;
            const warehouse = await Warehouse.findOne({
                where: {
                    warehouseId
                },
                include: [
                    WarehouseType,
                    {
                        model:Address,
                        include: [Department,District,Via]
                    }
                ]
              })

            return res.json({
                code: 200,
                object: warehouse
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
            const warehouses = await Warehouse.findAll({
                include: [
                    WarehouseType,
                    {
                        model:Address,
                        include: [Department,District,Via]
                    }
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: warehouses
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
        
    }

    async insert(req, res) {
        try{
            const {warehouseTypeId, warehouseName, warehouseTelephone, warehouseColorCard, address} = req.body;
            const addressId = await AddressController.insert(address);

            const newWarehouse =  await Warehouse.create({
                warehouseTypeId,
                warehouseName,
                warehouseTelephone,
                warehouseColorCard,
                addressId
            });

            return res.json({
                code: 200,
                object: newWarehouse
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
            const {warehouseId, warehouseName, warehouseTelephone, warehouseColorCard, address} = req.body;
            await AddressController.update(address);
            const warehouseUpdated = await Warehouse.update({warehouseName, warehouseTelephone, warehouseColorCard, updatedAt: new Date()}, {
                where: {
                    warehouseId
                }
            });

            return res.json({
                code: warehouseUpdated[0]
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
            const {warehouseId} = req.body;
            const warehouseDesabled= await Warehouse.update({ enabled: false}, {
                where: {
                    warehouseId
                }
            });
 
            return res.json({
                code: warehouseDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }

}
 

 