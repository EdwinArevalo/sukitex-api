const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
 
//DATABASE
const sequelize = require('./models/db/database');
require('./models/db/associations');

//ROUTES
const indexRoute = require('./routes/index.routes');
const authRoute = require('./routes/auth.routes');
const productRoute = require('./routes/product.routes');
const productCategoryRoute = require('./routes/productCategory.routes');
const productVariantRoute = require('./routes/productVariant.routes');
const warehouseRoute = require('./routes/warehouse.routes');
const productStockRoute = require('./routes/productStock.routes');
const materialRoute = require('./routes/material.routes');
const addressRoute = require('./routes/address.routes');
const providerRoute = require('./routes/provider.routes');
const clientRoute = require('./routes/client.routes');
const materialStockRoute = require('./routes/materialStock.routes');
const sizeRoute = require('./routes/size.routes');
const viaRoute = require('./routes/via.routes');
const warehouseTypeRoute = require('./routes/warehouseType.routes');
const unitRoute = require('./routes/unit.routes');

const colorRoute = require('./routes/color.routes');
const departmentRoute = require('./routes/department.routes');
const districtRoute = require('./routes/district.routes');

const userRoute = require('./routes/user.routes');
const roleRoute = require('./routes/role.routes');

const modificationTypeRoute = require('./routes/modificationType.routes');
const adjustmentReasonRoute = require('./routes/adjustmentReason.routes');
const materialStockRecordRoute = require('./routes/materialStockRecord.routes');
const productStockRecordRoute = require('./routes/productStockRecord.routes');

const materialPurchaseRoute = require('./routes/materialPurchase.routes');
const productPurchaseRoute = require('./routes/productPurchase.routes');
const saleRoute = require('./routes/sale.routes');
const productInventoryAdjustmentRoute = require('./routes/productInventoryAdjustment.routes');
const materialInventoryAdjustmentRoute = require('./routes/materialInventoryAdjustment.routes');

const productTransferRoute = require('./routes/productTransfer.routes');
const materialTransferRoute = require('./routes/materialTransfer.routes');

const kardexRoute = require('./routes/kardex.routes');
const chartRoute = require('./routes/chart.routes');

module.exports = class App {
    constructor(PORT) {
        this.databaseConnection();
        this.app = express();
        this.settings(PORT);
        this.middlewares()
        this.routes();
    }

    databaseConnection() {
        sequelize.authenticate().then( () => {
            console.log('Database connection OK!');
        }).catch(err => {
            console.log('Error to connect database ', err);
        });
    }

    settings(PORT) {
        this.app.set('port', process.env.PORT || PORT );
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(morgan('dev'));
        // this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
        
    }

    routes() {
        this.app.use(indexRoute);
        this.app.use('/api/auth', authRoute);
        this.app.use('/api/products', productRoute);
        this.app.use('/api/productCategories', productCategoryRoute);
        this.app.use('/api/productVariants', productVariantRoute);
        this.app.use('/api/warehouses', warehouseRoute);
        this.app.use('/api/productStocks', productStockRoute);
        this.app.use('/api/materials', materialRoute);
        this.app.use('/api/addresses', addressRoute);
        this.app.use('/api/providers', providerRoute);
        this.app.use('/api/clients', clientRoute);        
        this.app.use('/api/materialStocks', materialStockRoute);

        this.app.use('/api/sizes', sizeRoute);
        this.app.use('/api/vias', viaRoute);
        this.app.use('/api/warehouseTypes', warehouseTypeRoute);
        this.app.use('/api/units', unitRoute);
        this.app.use('/api/colors', colorRoute);
        this.app.use('/api/departments', departmentRoute);
        this.app.use('/api/districts', districtRoute);

        this.app.use('/api/user', userRoute); 
        this.app.use('/api/roles', roleRoute); 

        this.app.use('/api/modificationTypes', modificationTypeRoute); 
        this.app.use('/api/adjustmentReasons', adjustmentReasonRoute); 

        this.app.use('/api/materialStockRecords', materialStockRecordRoute); 
        this.app.use('/api/productStockRecords', productStockRecordRoute); 

        this.app.use('/api/materialPurchases', materialPurchaseRoute); 
        this.app.use('/api/productPurchases', productPurchaseRoute); 
        this.app.use('/api/sales', saleRoute); 

        this.app.use('/api/productInventoryAdjustments', productInventoryAdjustmentRoute); 
        this.app.use('/api/materialInventoryAdjustments', materialInventoryAdjustmentRoute);

        this.app.use('/api/productTransfers', productTransferRoute); 
        this.app.use('/api/materialTransfers', materialTransferRoute); 
        
        this.app.use('/api/kardex', kardexRoute); 
        this.app.use('/api/chart', chartRoute); 
    }

    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log(`SKTXAPI listen on port ${this.app.get('port')}`)  
    }
}
 