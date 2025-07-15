import { Document } from 'mongoose';
import { 
  TenantSettings, 
  TenantFeatures, 
  TenantProfile, 
  TenantModule, 
  CustomerType 
} from './common';

export interface ITenant extends Document {
  name: string;
  subdomain: string;
  active: boolean;
  apiGateway: string;
  cubeService: string;
  socketService: string;
  enabledSimulations: boolean;
  features: TenantFeatures;
  modules: TenantModule[];
  profile: TenantProfile;
  settings: TenantSettings;
  integrations: string[];
  typeOfCustomer: CustomerType[];
  createdAt: number;
  updatedAt: number;
}