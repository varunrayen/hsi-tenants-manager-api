import { Document } from 'mongoose';

export interface UserPermission {
  route: string;
  readable: boolean;
  writable: boolean;
}

export interface UserPagePreference {
  route: string;
  visible: boolean;
}

export interface UserMeta {
  lastLogin?: number;
  lastLoginPlatform?: string;
  lastLoginIp?: string;
  lastLoginOs?: string | null;
  lastLoginOsVersion?: string | null;
  lastLoginModel?: string | null;
  lastLoginAppVersionName?: string | null;
  lastLoginAppVersionCode?: string | null;
}

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  role: string;
  hopstackModules: any | null;
  permissions: UserPermission[];
  pagePreferences: UserPagePreference[];
  tenant: string;
  isDefault: boolean;
  email: string;
  isEmailVerified: boolean;
  termsAndConditionsAccepted: boolean;
  activated: boolean;
  meta: UserMeta;
  createdAt: Date;
  updatedAt: Date;
}