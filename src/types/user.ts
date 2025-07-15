import { Document } from 'mongoose';
import { UserRole } from './common';

export interface IUser extends Document {
  tenantId: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}