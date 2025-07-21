import mongoose, { Schema } from 'mongoose';
import { ITenant, ICustomer, IWarehouse, IUser, IRole, IEntityType } from '../types';

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  apiGateway: { type: String, required: true },
  cubeService: { type: String, required: true },
  socketService: { type: String, required: true },
  enabledSimulations: { type: Boolean, default: false },
  features: {
    combinedPackAndPrep: { type: Boolean, default: false },
    combinedReceiveAndPrep: { type: Boolean, default: true },
    dropship: { type: Boolean, default: true },
    maximumPalletClearanceStrategy: { type: Boolean, default: true },
    multiplePickingStrategies: { type: Boolean, default: true },
    optimizedBatching: { type: Boolean, default: false },
    rateShopping: { type: Boolean, default: true }
  },
  modules: [{
    enabled: { type: Boolean, default: true },
    name: { type: String, required: true }
  }],
  profile: {
    businessAddress: { type: String, required: true },
    businessName: { type: String, required: true }
  },
  settings: {
    activities: {
      packing: {
        boxSelection: { type: Boolean, default: true }
      },
      receiving: {
        putawayBinLocation: { type: Boolean, default: false },
        poEnabled: { type: Boolean, default: false }
      }
    },
    allowConstituentsPickingForBundleOrders: { type: Boolean, default: true },
    backOrderEnabled: { type: Boolean, default: true },
    blockParentLocations: { type: Boolean, default: true },
    enableLocationValidation: { type: Boolean, default: true },
    isSTOEnabled: { type: Boolean, default: true },
    metricsConfig: {
      preferredDimensionUnit: { type: [String], default: ['inches'] },
      preferredWeightUnit: { type: [String], default: ['pounds'] }
    },
    multiAccountIntegrationSupportEnabled: { type: Boolean, default: true },
    isOutboundPlanningEnabled: { type: Boolean, default: true }
  },
  integrations: { type: [String], default: [] },
  typeOfCustomer: { 
    type: [String], 
    enum: ['3PL', 'Brand'], 
    default: ['3PL'] 
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
}, {
  timestamps: false
});

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  tenant: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  warehouses: [{ type: String }],
  currency: { type: String, required: true },
  currentBillingProfile: { type: String, default: null },
  active: { type: Boolean, default: true },
  metaData: {
    ticket: { type: String }
  },
  settings: {
    workflows: {
      inbound: {
        enabled: { type: Boolean, default: true }
      }
    }
  }
}, {
  timestamps: true
});

const addressSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  zip: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  line1: { type: String, required: true }
}, { _id: false });

const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  tenant: { type: String, required: true },
  location: { type: String, required: true },
  splitOrdersEnabled: { type: Boolean, default: null },
  typeOfWarehouse: [{ type: String, required: true }],
  address: { type: addressSchema, required: true },
  storageTypes: [{ type: String, required: true }]
}, {
  timestamps: true
});

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  hopstackModules: { type: Schema.Types.Mixed, default: null },
  permissions: [{
    route: { type: String, required: true },
    readable: { type: Boolean, required: true },
    writable: { type: Boolean, required: true }
  }],
  pagePreferences: [{
    route: { type: String, required: true },
    visible: { type: Boolean, required: true }
  }],
  tenant: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  isEmailVerified: { type: Boolean, default: false },
  termsAndConditionsAccepted: { type: Boolean, default: false },
  activated: { type: Boolean, default: false },
  meta: {
    lastLogin: { type: Number },
    lastLoginPlatform: { type: String },
    lastLoginIp: { type: String },
    lastLoginOs: { type: String, default: null },
    lastLoginOsVersion: { type: String, default: null },
    lastLoginModel: { type: String, default: null },
    lastLoginAppVersionName: { type: String, default: null },
    lastLoginAppVersionCode: { type: String, default: null }
  }
}, {
  timestamps: true
});

const RoleSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  permissions: { type: [String], required: true },
  isSystemRole: { type: Boolean, default: false }
}, {
  timestamps: true
});

const permissionOptionSchema = new Schema({
  name: { type: String, required: true },
  href: { type: String },
  selectedImage: { type: String, required: true },
  unselectedImage: { type: String, required: true },
  type: { type: String },
  readable: { type: Boolean },
  writable: { type: Boolean },
  isBeta: { type: Boolean },
  children: [{ type: Schema.Types.Mixed }]
}, { _id: false });

const EntityTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
  entityParent: { type: String, required: true },
  attributes: {
    permissionOptions: [permissionOptionSchema]
  },
  customers: { type: Schema.Types.Mixed, default: null },
  warehouses: { type: Schema.Types.Mixed, default: null },
  subEntityParents: { type: Schema.Types.Mixed, default: null },
  code: { type: String, default: null },
  tenant: { type: String, required: true }
}, {
  timestamps: true
});

export const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
export const Role = mongoose.model<IRole>('Role', RoleSchema);
export const EntityType = mongoose.model<IEntityType>('EntityType', EntityTypeSchema);