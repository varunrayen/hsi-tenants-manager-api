import { Document } from 'mongoose';

export interface CustomerSettings {
  workflows: {
    inbound: {
      enabled: boolean;
    };
  };
}

export interface CustomerMetaData {
  ticket?: string;
}

export interface ICustomer extends Document {
  name: string;
  code: string;
  tenant: string;
  isDefault: boolean;
  warehouses: string[];
  currency: string;
  currentBillingProfile: string | null;
  active: boolean;
  metaData: CustomerMetaData;
  settings: CustomerSettings;
  createdAt: Date;
  updatedAt: Date;
}