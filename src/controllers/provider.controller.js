const Provider = require('../models/Provider');
const Address = require('../models/Address');

const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

const Pagination = require('../helpers/pagination');

const AddressController = require('./address.controller');

module.exports = class ProviderContoller {

    async getById(req, res, next) {
        try{
            const {providerId} = req.body;
            const provider = await Provider.findOne({
                where: {
                    providerId
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
                object: provider
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
            const providers = await Provider.findAll({
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
                list: providers
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
            const providers = await Provider.findAndCountAll({
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

            const response = Pagination.getPagingData(providers,page,limit);

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
            const {providerNames, providerSurnames, providerTreatment, providerRuc, providerTelephone, providerEmail, address} = req.body;
            const addressId = await AddressController.insert(address);

            const newProvider =  await Provider.create({
                providerNames, 
                providerSurnames, 
                providerTreatment, 
                providerRuc, 
                providerTelephone, 
                providerEmail,
                addressId
            });

            return res.json({
                code: 200,
                object: newProvider
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
            const {providerId, providerNames, providerSurnames, providerTreatment, providerRuc, providerTelephone, providerEmail, address} = req.body;
            await AddressController.update(address);

            const providerUpdated = await Provider.update({ providerNames, providerSurnames, providerTreatment, providerRuc, providerTelephone, providerEmail, updatedAt: new Date()}, {
                where: {
                    providerId
                }
            });

            return res.json({
                code: providerUpdated[0]
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
            const {providerId} = req.body;
            const providerDesabled= await Provider.update({ enabled: false}, {
                where: {
                    providerId
                }
            });

            return res.json({
                code: providerDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 