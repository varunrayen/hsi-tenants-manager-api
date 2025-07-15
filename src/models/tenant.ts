import mongoose, { Schema } from 'mongoose';
import { ITenant, ICustomer, IWarehouse, IUser, IRole } from '../types';

const TenantSchema: Schema = new Schema({
  tenantId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  customerId: { type: Schema.Types.ObjectId, required: true },
  warehouseId: { type: Schema.Types.ObjectId, required: true },
  superAdminId: { type: Schema.Types.ObjectId, required: true },
  settings: {
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    features: { type: [String], default: [] }
  }
}, {
  timestamps: true
});

const CustomerSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  billingInfo: {
    planType: { type: String, required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    paymentMethod: { type: String, required: true }
  }
}, {
  timestamps: true
});

const WarehouseSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  manager: { type: String, required: true },
  capacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const UserSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'user'], required: true },
  isActive: { type: Boolean, default: true },
  permissions: { type: [String], default: [] }
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

export const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
export const Role = mongoose.model<IRole>('Role', RoleSchema);