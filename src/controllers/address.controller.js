const Address = require('../models/Address');
const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

module.exports = class AddressContoller {

    async getById(req, res, next) {
        try{
            const {addressId} = req.body;
            const address = await Address.findOne({
                where: {
                    addressId
                },
                include: [Department,District,Via]
              })

            return res.json({
                code: 200,
                object: address
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
            const addresses = await Address.findAll({
                include: [Department,District,Via]
            });
            return res.json({
                code: 200,
                list: addresses
            });
        
        }catch(err) {
            return res.status(500).json({
                code: 0,
                error: err
            });
        }
    }


    static async insert(address) {
        try{
            const {departmentId, districtId, viaId, addressViaName, addressNumber, addressReference} = address;
            const newAddress =  await Address.create({
                departmentId,
                districtId,
                viaId,
                addressViaName,
                addressNumber,
                addressReference
            });

            return newAddress.addressId;
        
        }catch(err) {
            return 0;
        }   
    }

    static async update(address){
        try{
            const {addressId, departmentId, districtId, viaId, addressViaName, addressNumber, addressReference } = address;
            await Address.update({ departmentId, districtId, viaId, addressViaName, addressNumber, addressReference, updatedAt: new Date()}, {
                where: {
                    addressId
                }
            }); 
            
            return 1;

        }catch(err) {
            return 0;
        } 
    }

    // async delete(req, res){
    //     try{
    //         const {addressId} = req.body;
    //         const addressDesabled= await Address.update({ enabled: false}, {
    //             where: {
    //                 addressId
    //             }
    //         });

    //         return res.json({
    //             code: addressDesabled[0]
    //         });
        
    //     }catch(err) {
    //         return res.json({
    //             code: 0,
    //             error: err
    //         });
    //     } 
    // }
}
 

 