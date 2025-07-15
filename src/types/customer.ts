import { Document } from 'mongoose';
import { Address, BillingInfo } from './common';

export interface ICustomer extends Document {
  tenantId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  billingInfo: BillingInfo;
  createdAt: Date;
  updatedAt: Date;
}