const Warehouse = require('../Warehouse');
const WarehouseType = require('../WarehouseType');
const Product = require('../Product');
const ProductCategory = require('../ProductCategory');
const ProductVariant = require('../ProductVariant');
const ProductStock = require('../ProductStock');
const ProductStockRecord = require('../ProductStockRecord');
const ProductPurchase = require('../ProductPurchase');
const ProductPurchaseDetail = require('../ProductPurchaseDetail');
const ProductInventoryAdjustment = require('../ProductInventoryAdjustment');
const ProductTransfer = require('../ProductTransfer');
const Material = require('../Material');
const MaterialStock = require('../MaterialStock');
const MaterialStockRecord = require('../MaterialStockRecord');
const MaterialPurchase = require('../MaterialPurchase');
const MaterialPurchaseDetail = require('../MaterialPurchaseDetail');
const MaterialInventoryAdjustment = require('../MaterialInventoryAdjustment');
const MaterialTransfer = require('../MaterialTransfer');
const Sale = require('../Sale');
const SaleDetail = require('../SaleDetail');
const Department = require('../Department');
const District = require('../District');
const Address = require('../Address');
const ModificationType = require('../ModificationType');
const AdjustmentReason = require('../AdjustmentReason');
const Via = require('../Via');
const Unit = require('../Unit');
const Size = require('../Size');
const Color = require('../Color');
const User = require('../User');
const Client = require('../Client');
const Provider = require('../Provider');
const Role = require('../Role');
const UserRole = require('../UserRole');

//Warehouse
WarehouseType.hasOne(Warehouse, {foreignKey: 'warehouseTypeId'});
Warehouse.belongsTo(WarehouseType, {foreignKey: 'warehouseTypeId'});

Address.hasOne(Warehouse, {foreignKey: 'addressId'});
Warehouse.belongsTo(Address, {foreignKey: 'addressId'});

//Product
ProductCategory.hasOne(Product, {foreignKey: 'productCategoryId'});
Product.belongsTo(ProductCategory, {foreignKey: 'productCategoryId'});

//ProductVariant
Product.hasOne(ProductVariant, {foreignKey: 'productId'});
ProductVariant.belongsTo(Product, {foreignKey: 'productId'});

Size.hasOne(ProductVariant, {foreignKey: 'sizeId'});
ProductVariant.belongsTo(Size, {foreignKey: 'sizeId'});

Color.hasOne(ProductVariant, {foreignKey: 'colorId'});
ProductVariant.belongsTo(Color, {foreignKey: 'colorId'});

//ProductStock
ProductVariant.hasOne(ProductStock, {foreignKey: 'productVariantId'});
ProductStock.belongsTo(ProductVariant, {foreignKey: 'productVariantId'});

Warehouse.hasOne(ProductStock, {foreignKey: 'warehouseId'});
ProductStock.belongsTo(Warehouse, {foreignKey: 'warehouseId'});

//District
Department.hasOne(District, {foreignKey: 'departmentId'});
District.belongsTo(Department, {foreignKey: 'departmentId'});

//Address
Department.hasOne(Address, {foreignKey: 'departmentId'});
Address.belongsTo(Department, {foreignKey: 'departmentId'});

District.hasOne(Address, {foreignKey: 'districtId'});
Address.belongsTo(District, {foreignKey: 'districtId'});

Via.hasOne(Address, {foreignKey: 'viaId'});
Address.belongsTo(Via, {foreignKey: 'viaId'});

//Provider
Address.hasOne(Provider, {foreignKey: 'addressId'});
Provider.belongsTo(Address, {foreignKey: 'addressId'});

//MaterialStock
Warehouse.hasOne(MaterialStock, {foreignKey: 'warehouseId'});
MaterialStock.belongsTo(Warehouse, {foreignKey: 'warehouseId'});

Material.hasOne(MaterialStock, {foreignKey: 'materialId'});
MaterialStock.belongsTo(Material, {foreignKey: 'materialId'});

Unit.hasOne(MaterialStock, {foreignKey: 'unitId'});
MaterialStock.belongsTo(Unit, {foreignKey: 'unitId'});

Provider.hasOne(MaterialStock, {foreignKey: 'providerId'});
MaterialStock.belongsTo(Provider, {foreignKey: 'providerId'});

//User
Address.hasOne(User, {foreignKey: 'addressId'});
User.belongsTo(Address, {foreignKey: 'addressId'});

//Role
User.hasMany(UserRole, {foreignKey: 'userId'});
UserRole.belongsTo(User, {foreignKey: 'userRoleId'});

Role.hasOne(UserRole, {foreignKey: 'roleId'});
UserRole.belongsTo(Role, {foreignKey: 'roleId'});

//Client
Address.hasOne(Client, {foreignKey: 'addressId'});
Client.belongsTo(Address, {foreignKey: 'addressId'});


//ProductStockRecord
ProductStock.hasOne(ProductStockRecord, {foreignKey: 'productStockId'});
ProductStockRecord.belongsTo(ProductStock, {foreignKey: 'productStockId'});

ModificationType.hasOne(ProductStockRecord, {foreignKey: 'modificationTypeId'});
ProductStockRecord.belongsTo(ModificationType, {foreignKey: 'modificationTypeId'});

//MaterialStockRecord
MaterialStock.hasOne(MaterialStockRecord, {foreignKey: 'materialStockId'});
MaterialStockRecord.belongsTo(MaterialStock, {foreignKey: 'materialStockId'});

ModificationType.hasOne(MaterialStockRecord, {foreignKey: 'modificationTypeId'});
MaterialStockRecord.belongsTo(ModificationType, {foreignKey: 'modificationTypeId'});


//MaterialPurchase
User.hasOne(MaterialPurchase, {foreignKey: 'userId'});
MaterialPurchase.belongsTo(User, {foreignKey: 'userId'});

Provider.hasOne(MaterialPurchase, {foreignKey: 'providerId'});
MaterialPurchase.belongsTo(Provider, {foreignKey: 'providerId'});

//MaterialPurchasedetail
MaterialStock.hasOne(MaterialPurchaseDetail, {foreignKey: 'materialStockId'});
MaterialPurchaseDetail.belongsTo(MaterialStock, {foreignKey: 'materialStockId'});

MaterialPurchase.hasMany(MaterialPurchaseDetail, {foreignKey: 'materialPurchaseId'});
MaterialPurchaseDetail.belongsTo(MaterialPurchase, {foreignKey: 'materialPurchaseId'});

MaterialStockRecord.hasOne(MaterialPurchaseDetail, {foreignKey: 'materialStockRecordId'});
MaterialPurchaseDetail.belongsTo(MaterialStockRecord, {foreignKey: 'materialStockRecordId'});


//ProductPurchase
User.hasOne(ProductPurchase, {foreignKey: 'userId'});
ProductPurchase.belongsTo(User, {foreignKey: 'userId'});

Provider.hasOne(ProductPurchase, {foreignKey: 'providerId'});
ProductPurchase.belongsTo(Provider, {foreignKey: 'providerId'});

//ProductPurchasedetail
ProductStock.hasOne(ProductPurchaseDetail, {foreignKey: 'productStockId'});
ProductPurchaseDetail.belongsTo(ProductStock, {foreignKey: 'productStockId'});

ProductPurchase.hasMany(ProductPurchaseDetail, {foreignKey: 'productPurchaseId'});
ProductPurchaseDetail.belongsTo(ProductPurchase, {foreignKey: 'productPurchaseId'});

ProductStockRecord.hasOne(ProductPurchaseDetail, {foreignKey: 'productStockRecordId'});
ProductPurchaseDetail.belongsTo(ProductStockRecord, {foreignKey: 'productStockRecordId'});


//Sale
User.hasOne(Sale, {foreignKey: 'userId'});
Sale.belongsTo(User, {foreignKey: 'userId'});

Client.hasOne(Sale, {foreignKey: 'clientId'});
Sale.belongsTo(Client, {foreignKey: 'clientId'});

//SaleDetail
ProductStock.hasOne(SaleDetail, {foreignKey: 'productStockId'});
SaleDetail.belongsTo(ProductStock, {foreignKey: 'productStockId'});

Sale.hasMany(SaleDetail, {foreignKey: 'saleId'});
SaleDetail.belongsTo(Sale, {foreignKey: 'saleId'});

ProductStockRecord.hasOne(SaleDetail, {foreignKey: 'productStockRecordId'});
SaleDetail.belongsTo(ProductStockRecord, {foreignKey: 'productStockRecordId'});


//ProductInventoryAdjustment
ProductStock.hasOne(ProductInventoryAdjustment, {foreignKey: 'productStockId'});
ProductInventoryAdjustment.belongsTo(ProductStock, {foreignKey: 'productStockId'});

AdjustmentReason.hasOne(ProductInventoryAdjustment, {foreignKey: 'adjustmentReasonId'});
ProductInventoryAdjustment.belongsTo(AdjustmentReason, {foreignKey: 'adjustmentReasonId'});

ProductStockRecord.hasOne(ProductInventoryAdjustment, {foreignKey: 'productStockRecordId'});
ProductInventoryAdjustment.belongsTo(ProductStockRecord, {foreignKey: 'productStockRecordId'});

User.hasOne(ProductInventoryAdjustment, {foreignKey: 'userId'});
ProductInventoryAdjustment.belongsTo(User, {foreignKey: 'userId'});


//MaterialInventoryAdjustment
MaterialStock.hasOne(MaterialInventoryAdjustment, {foreignKey: 'materialStockId'});
MaterialInventoryAdjustment.belongsTo(MaterialStock, {foreignKey: 'materialStockId'});

AdjustmentReason.hasOne(MaterialInventoryAdjustment, {foreignKey: 'adjustmentReasonId'});
MaterialInventoryAdjustment.belongsTo(AdjustmentReason, {foreignKey: 'adjustmentReasonId'});

MaterialStockRecord.hasOne(MaterialInventoryAdjustment, {foreignKey: 'materialStockRecordId'});
MaterialInventoryAdjustment.belongsTo(MaterialStockRecord, {foreignKey: 'materialStockRecordId'});

User.hasOne(MaterialInventoryAdjustment, {foreignKey: 'userId'});
MaterialInventoryAdjustment.belongsTo(User, {foreignKey: 'userId'});


//ProductTransfer 
ProductStock.hasOne(ProductTransfer, {foreignKey: 'productStockId'});
ProductTransfer.belongsTo(ProductStock, {foreignKey: 'productStockId'});

Warehouse.hasOne(ProductTransfer, { foreignKey: 'destinationWarehouseId'});
ProductTransfer.belongsTo(Warehouse, {as: 'destinationWarehouse',foreignKey: 'destinationWarehouseId'});

Warehouse.hasOne(ProductTransfer, { foreignKey: 'originWarehouseId'});
ProductTransfer.belongsTo(Warehouse, {as: 'originWarehouse', foreignKey: 'originWarehouseId'});

ProductStockRecord.hasOne(ProductTransfer, {foreignKey: 'productStockRecordId'});
ProductTransfer.belongsTo(ProductStockRecord, {foreignKey: 'productStockRecordId'});

User.hasOne(ProductTransfer, {foreignKey: 'userId'});
ProductTransfer.belongsTo(User, {foreignKey: 'userId'});


//MaterialTransfer
MaterialStock.hasOne(MaterialTransfer, {foreignKey: 'materialStockId'});
MaterialTransfer.belongsTo(MaterialStock, {foreignKey: 'materialStockId'});

Warehouse.hasOne(MaterialTransfer, { foreignKey: 'destinationWarehouseId'});
MaterialTransfer.belongsTo(Warehouse, {as: 'destinationWarehouse',foreignKey: 'destinationWarehouseId'});

Warehouse.hasOne(MaterialTransfer, { foreignKey: 'originWarehouseId'});
MaterialTransfer.belongsTo(Warehouse, {as: 'originWarehouse', foreignKey: 'originWarehouseId'});

MaterialStockRecord.hasOne(MaterialTransfer, {foreignKey: 'materialStockRecordId'});
MaterialTransfer.belongsTo(MaterialStockRecord, {foreignKey: 'materialStockRecordId'});

User.hasOne(MaterialTransfer, {foreignKey: 'userId'});
MaterialTransfer.belongsTo(User, {foreignKey: 'userId'});

