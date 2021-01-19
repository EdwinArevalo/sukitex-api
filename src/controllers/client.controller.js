const Client = require('../models/Client');
const Address = require('../models/Address');

const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

const Pagination = require('../helpers/pagination');

const AddressController = require('./address.controller');

module.exports = class ClientContoller {

    async getById(req, res, next) {
        try{
            const {clientId} = req.body;
            const client = await Client.findOne({
                where: {
                    clientId
                },
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    }
                ]
              })

            return res.json({
                code: 200,
                object: client
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
            const clients = await Client.findAll({
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    }
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: clients
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
            const Clients = await Client.findAndCountAll({
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    }
                ],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(Clients,page,limit);

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
            const {clientNames, clientSurnames, clientTreatment, clientRuc, clientTelephone, clientEmail, address} = req.body;
            const addressId = await AddressController.insert(address);

            const newClient =  await Client.create({
                clientNames, 
                clientSurnames, 
                clientTreatment, 
                clientRuc, 
                clientTelephone, 
                clientEmail,
                addressId
            });

            return res.json({
                code: 200,
                object: newClient
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
            const {clientId, clientNames, clientSurnames, clientTreatment, clientRuc, clientTelephone, clientEmail, address} = req.body;
            await AddressController.update(address);

            const ClientUpdated = await Client.update({ clientNames, clientSurnames, clientTreatment, clientRuc, clientTelephone, clientEmail, updatedAt: new Date()}, {
                where: {
                    clientId
                }
            });

            return res.json({
                code: ClientUpdated[0]
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
            const {clientId} = req.body;
            const ClientDesabled= await Client.update({ enabled: false}, {
                where: {
                    clientId
                }
            });

            return res.json({
                code: ClientDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 