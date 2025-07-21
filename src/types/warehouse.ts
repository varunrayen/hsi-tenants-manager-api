import { Document } from 'mongoose';

export interface WarehouseAddress {
  email: string;
  phone: string;
  zip: string;
  city: string;
  country: string;
  line1: string;
}

export interface IWarehouse extends Document {
  name: string;
  code: string;
  isDefault: boolean;
  active: boolean;
  tenant: string;
  location: string;
  splitOrdersEnabled: boolean | null;
  typeOfWarehouse: string[];
  address: WarehouseAddress;
  storageTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}