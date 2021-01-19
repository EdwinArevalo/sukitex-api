const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
      var token =bearerHeader.split(" ")[1];
    }else {
      return res.status(403).json({ msg: "No se ha proporcionado ningún token!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        //console.log(decoded)
        req.userId = decoded.Id;
    
        const user = await User.findOne({where: { userId: req.userId}});
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado!" });
    
        next();
      } catch (error) {
        return res.status(401).json({ code: 0, error: 'INVALID_TOKEN', msg: "Inautorizado!" });
    }
}