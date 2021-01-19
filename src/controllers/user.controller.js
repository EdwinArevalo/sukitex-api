const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Address = require('../models/Address');

const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

const Pagination = require('../helpers/pagination');

const AddressController = require('./address.controller');

module.exports = class UserContoller {

    async getById(req, res, next) {
        try{
            const {userId} = req.body;
            const user = await User.findOne({
                where: {
                    userId
                },
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    },
                    // {
                    //     model: UserRole
                    // }, 
                ]
              })

            return res.json({
                code: 200,
                object: user
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
            const Users = await User.findAll({
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    },
                    // {
                    //     model: UserRole
                    // }, 
                ],
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: Users
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
            const Users = await User.findAndCountAll({
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    },
                    // {
                    //     model: UserRole
                    // }, 
                ],
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(Users,page,limit);

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

    async update(req, res){
        try{
            const {userId, userNames, userSurnames, userTelephone, address} = req.body;
            await AddressController.update(address);
            
            const UserUpdated = await User.update({  userNames, userSurnames, userTelephone, updatedAt: new Date()}, {
                where: {
                    userId
                }
            });

            return res.json({
                code: UserUpdated[0]
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
            const {userId} = req.body;
            const UserDesabled= await User.update({ enabled: false}, {
                where: {
                    userId
                }
            });

            return res.json({
                code: UserDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 