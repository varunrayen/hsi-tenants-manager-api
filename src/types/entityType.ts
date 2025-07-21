import { Document } from 'mongoose';

export interface PermissionOption {
  name: string;
  href?: string;
  selectedImage: string;
  unselectedImage: string;
  type?: string;
  readable?: boolean;
  writable?: boolean;
  isBeta?: boolean;
  children?: PermissionOption[];
}

export interface EntityTypeAttributes {
  permissionOptions: PermissionOption[];
}

export interface IEntityType extends Document {
  name: string;
  entityParent: string;
  attributes: EntityTypeAttributes;
  customers: any | null;
  warehouses: any | null;
  subEntityParents: any | null;
  code: string | null;
  tenant: string;
  createdAt: Date;
  updatedAt: Date;
}