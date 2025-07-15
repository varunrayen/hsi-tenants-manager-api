import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITenant extends Document {
  tenantId: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  customerId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  superAdminId: Types.ObjectId;
  settings: {
    timezone: string;
    currency: string;
    language: string;
    features: string[];
  };
}

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

export const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);

export interface ICustomer extends Document {
  tenantId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingInfo: {
    planType: string;
    billingCycle: 'monthly' | 'yearly';
    paymentMethod: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IWarehouse extends Document {
  tenantId: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  manager: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  tenantId: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'user';
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRole extends Document {
  tenantId: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantRequest {
  tenant: {
    name: string;
    domain: string;
  };
  customer: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    billingInfo: {
      planType: string;
      billingCycle: 'monthly' | 'yearly';
      paymentMethod: string;
    };
  };
  warehouse: {
    name: string;
    code: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    manager: string;
    capacity: number;
  };
  superAdmin: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  settings?: {
    timezone?: string;
    currency?: string;
    language?: string;
    features?: string[];
  };
}

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

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
export const Role = mongoose.model<IRole>('Role', RoleSchema);