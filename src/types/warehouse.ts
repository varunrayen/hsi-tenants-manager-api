import { Document } from 'mongoose';
import { Address } from './common';

export interface IWarehouse extends Document {
  tenantId: string;
  name: string;
  code: string;
  address: Address;
  manager: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}