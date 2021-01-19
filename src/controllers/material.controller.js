const Material = require('../models/Material');
const Pagination = require('../helpers/pagination');

module.exports = class MaterialContoller {

    async getById(req, res, next) {
        try{
            const {materialId} = req.body;
            const material = await Material.findOne({
                where: {
                    materialId
                }
              })

            return res.json({
                code: 200,
                object: material
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
            const materials = await Material.findAll({            
                order: [['createdAt','DESC']]
            });
            return res.json({
                code: 200,
                list: materials
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
            const materials = await Material.findAndCountAll({            
                order: [['createdAt','DESC']],
                limit,
                offset
            });

            const response = Pagination.getPagingData(materials,page,limit);

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
            const {materialName} = req.body;
            const newMaterial =  await Material.create({
                materialName
            });

            return res.json({
                code: 200,
                object: newMaterial
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
            const {materialId, materialName} = req.body;
            const materialUpdated = await Material.update({ materialName, updatedAt: new Date()}, {
                where: {
                    materialId
                }
            });

            return res.json({
                code: materialUpdated[0]
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
            const {materialId} = req.body;
            const materialDesabled= await Material.update({ enabled: false}, {
                where: {
                    materialId
                }
            });

            return res.json({
                code: materialDesabled[0]
            });
        
        }catch(err) {
            return res.status(400).json({
                code: 0,
                error: err
            });
        } 
    }
}
 

 