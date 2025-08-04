// Central export for all models
export * from './tenant';
export * from './audit-log';

// Export schemas for regional connections
import { Schema } from 'mongoose';

const addressSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  zip: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  line1: { type: String, required: true }
}, { _id: false });

export const CustomerSchema: Schema = new Schema({
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
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
}, {
  timestamps: false
});

export const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  tenant: { type: String, required: true },
  location: { type: String, required: true },
  splitOrdersEnabled: { type: Boolean, default: null },
  typeOfWarehouse: [{ type: String, required: true }],
  address: { type: addressSchema, required: true },
  storageTypes: [{ type: String, required: true }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
}, {
  timestamps: false
});

export const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
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
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
}, {
  timestamps: false
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

export const EntityTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
  entityParent: { type: String, required: true },
  attributes: {
    permissionOptions: [permissionOptionSchema]
  },
  customers: { type: Schema.Types.Mixed, default: null },
  warehouses: { type: Schema.Types.Mixed, default: null },
  subEntityParents: { type: Schema.Types.Mixed, default: null },
  code: { type: String, default: null },
  tenant: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
}, {
  timestamps: false
});