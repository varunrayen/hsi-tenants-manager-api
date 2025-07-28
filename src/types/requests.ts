import { 
  Address, 
  BillingInfo, 
  TenantSettings, 
  TenantFeatures, 
  TenantProfile, 
  TenantModule, 
  CustomerType 
} from './common';

export interface CreateTenantRequest {
  tenant: {
    name: string;
    subdomain: string;
    apiGateway: string;
    cubeService: string;
    socketService: string;
    enabledSimulations?: boolean;
    features?: Partial<TenantFeatures>;
    modules?: TenantModule[];
    profile: TenantProfile;
    settings?: Partial<TenantSettings>;
    integrations?: string[];
    typeOfCustomer?: CustomerType[];
    region?: string;
    environment?: string;
  };
  performedBy?: {
    username: string;
    email?: string;
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
}