import { Document } from 'mongoose';

export interface IRole extends Document {
  tenantId: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}