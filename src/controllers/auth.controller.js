const User = require('../models/User');  
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');

const Encrypt = require('../helpers/encrypt');
const jwt = require('jsonwebtoken');

const Address = require('../models/Address');

const Department = require('../models/Department');
const District = require('../models/District');
const Via = require('../models/Via');

const AddressController = require('../controllers/address.controller');

const transporter = require('../helpers/sendEmail');

module.exports = class UserContoller {

    async isLogged(req, res) {
        return res.json({ code: 200, error: null, msg: "Autorizado!" });
    }
 
    async signUp(req, res) {
        try{
            const {userNames, password, userSurnames, userTelephone, userEmail, address, rolesId} = req.body; 

            if(userEmail != null && password != null ){
                const emailExist = await User.findOne({
                    where: { userEmail }
                });

                if(emailExist != null){
                    return res.json({ code: 0, msg: 'El correo electrónico proporcionado ya existe!'});
                }

                const isEmailValid =  Encrypt.isValidEmailAddress(userEmail);
                if(!isEmailValid){
                    return res.json({code: 0,msg: 'Correo electrónico no válido!'});
                }

                if(rolesId == null || typeof rolesId == 'undefined' || rolesId.length == 0){
                    return res.json({code: 0,msg: 'Los roles son requeridos!'});
                }

                for (var i = 0; i < rolesId.length; i++) {
                    const role = await Role.findOne({
                        where: { roleId: rolesId[i] }
                    });
                    if(role == null){
                        return res.json({ code: 0, msg:`El RoleId: ${rolesId[i]} no existe!`});  
                    }
                }

                const addressId = await AddressController.insert(address);                                
                const newUser =  await User.create({
                    userNames, 
                    password : await Encrypt.encryptPassword(password), 
                    userSurnames, 
                    userTelephone, 
                    userEmail, 
                    addressId
                }); 

                for (var i = 0; i < rolesId.length; i++) {
                    const role = await Role.findOne({
                        where: { roleId: rolesId[i] }
                    });
                    await UserRole.create({roleId: role.roleId, roleName: role.roleName, userId: newUser.userId});
                } 

                const token = jwt.sign({Id: newUser.userId},process.env.SECRET_KEY,{
                    expiresIn: '24h'
                });
                return res.json({ code: 200, token, object: newUser });  

            }
            return res.json({code: 0,msg: 'El correo y la contraseña son requeridos!'});            
        
        }catch(e) {
            return res.status(400).json({
                code: 0,
                msg: 'Se ha producido un error al guardar los datos!',
                error: e
            });
        }   
    }

    async signIn(req, res) {

        try{
            const {userEmail, password} = req.body;
            const userFound = await User.findOne({ where:{userEmail} });

            if(userFound == null){
                return res.status(200).json({ code: 0, msg: 'Usuario no encontrado!'});
            }

            const matchPassword = await Encrypt.comparePassword(password, userFound.password );
            if(!matchPassword){
                return res.status(200).json({ code: 0, msg: 'Contraseña incorrecta!'});
            }

            const token = jwt.sign({Id: userFound.userId},process.env.SECRET_KEY,{
                expiresIn: '24h'
            });

            const userResponse = await User.findOne({
                where: {
                    userId: userFound.userId
                },
                attributes: { exclude: ['password','enabled','createdAt','updatedAt'] },
                include: [
                    {
                        model: Address,
                        include: [Department, District, Via]
                    },
                    {
                        model: UserRole,
                        attributes: ['roleId', 'roleName']
                    }
                ],
            });
            
            return res.json({ code: 200, token, object: userResponse});

        }catch(err){
            return res.status(400).json({
                code: 0,
                msg: 'Se ha producido un error al validar los datos!',
                err
            });  
        } 

    }

    async sendEmail(username, email) {
        await transporter.sendMail({
            from: '"Código de verificación ✔" <sukitex.suport@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Código de verificación  ✔", // Subject line
            // text: "Hello world?", // plain text body
            html: `<b>hola ${username}</b>
            <p> Tu código de verificación es: RAAAAAAAA</p>`, // html body 
        });
    }

    async sendEmail(req, res) {
        const { username, email} = req.body; 

        try{
            const msg = await transporter.sendMail({
                from: '"Sukitex" <sukitex.suport@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Código de verificación ✔", // Subject line
                // text: "Hello world?", // plain text body
                html: `
                <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
                <tr height="200px">  
                    <td bgcolor="" width="600px">
                        <h1 style="color: #fff; text-align:center">Bienvenido</h1>
                        <p  style="color: #fff; text-align:center">
                            <span style="color: #e84393">${username} </span> 
                            tu código de verificación es <i>HWKMT</i>
                        </p>
                    </td>
                </tr>
                <tr bgcolor="#fff">
                    <td style="text-align:center">
                        <p style="color: #000">Sukitex, este mensaje se envió a ${email}.</p>
                    </td>
                </tr>
                </table>
            
            `, // html body
            });
    
            res.json({
                msg
            });

        }catch(err) {
            return res.status(500).json({
                code: 0,
                err
            });
        }

    }

}
 

 