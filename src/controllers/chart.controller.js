const sequelize = require('../models/db/database');

module.exports = class SaleContoller {  
    // getSalesByWeekDay 
    async getSalesByWeekDay(req, res){  
 
        const {first, latest} = req.body;
        
        const result = await sequelize.query("SELECT COUNT(saleId) AS 'sales', createdAt, "
        +" (ELT(WEEKDAY(createdAt) + 1, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')) AS weekDaySale"
        +" FROM Sales"
        +" WHERE createdAt >= '"+first+"' AND createdAt <= '"+latest+"' "
        +" GROUP BY DAY(createdAt)")

        // const sales = result[0]     
        // const days = [ 'Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        // for (let i = 0; i < days.length; i++) {
        //     for (let x = 0; x < sales.length; x++) {
        //         if(days[i] == sales[x].weekDaySale){
                    
        //         }
        //     }
        // } 
        return res.json({
            code: 200,
            sales: result[0]
        });
    }

    async getSalesByMonth(req, res){  
        const result = await sequelize.query("SELECT COUNT(*) AS 'sales',"
        +" createdAt,(ELT(WEEKDAY(createdAt) + 1, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')) AS weekDaySale"
        +" FROM Sales"
        +" where MONTH(createdAt) = MONTH(CURDATE())"
        +" GROUP BY DAY(createdAt)")
 
        return res.json({
            code: 200,
            sales: result[0]
        });
    }


    async getSalesByYear(req, res){  
        const result = await sequelize.query("SELECT COUNT(*) AS 'sales',"
        +" (ELT(MONTH(createdAt), 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre')) AS monthSale"
        +" FROM Sales"
        +" where YEAR(createdAt) = YEAR(CURDATE())"
        +" GROUP BY MONTH(createdAt)")
 
        return res.json({
            code: 200,
            sales: result[0]
        });
    }

} 

 