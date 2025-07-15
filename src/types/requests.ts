import { Address, BillingInfo, TenantSettings } from './common';

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
    address: Address;
    billingInfo: BillingInfo;
  };
  warehouse: {
    name: string;
    code: string;
    address: Address;
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
  settings?: Partial<TenantSettings>;
}