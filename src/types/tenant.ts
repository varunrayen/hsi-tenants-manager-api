import { Document, Types } from 'mongoose';
import { TenantSettings, TenantStatus } from './common';

export interface ITenant extends Document {
  tenantId: string;
  name: string;
  domain: string;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
  customerId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  superAdminId: Types.ObjectId;
  settings: TenantSettings;
}