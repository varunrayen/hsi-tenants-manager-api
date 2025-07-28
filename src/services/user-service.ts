import { IUser } from '../types';
import { User } from '../models';
import { BaseService } from './base-service';
import { hashPassword } from '../utils/helpers';

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async createSuperAdmin(tenantId: string, userData: any, session?: any): Promise<IUser> {
    const hashedPassword = await hashPassword(userData.password);
    const superAdminData = {
      name: `${userData.firstName} ${userData.lastName}`,
      username: userData.username,
      password: hashedPassword,
      role: 'ADMIN',
      hopstackModules: null,
      permissions: [
        { route: "/orders", readable: true, writable: true },
        { route: "/warehouses", readable: true, writable: true },
        { route: "/customers", readable: true, writable: true },
        { route: "/users", readable: true, writable: true }
      ],
      pagePreferences: [
        { route: "/orders", visible: true },
        { route: "/customers", visible: true },
        { route: "/users", visible: true }
      ],
      tenant: tenantId,
      isDefault: true,
      email: userData.email,
      isEmailVerified: true,
      termsAndConditionsAccepted: true,
      activated: true,
      meta: {
        lastLogin: Date.now(),
        lastLoginPlatform: "web",
        lastLoginIp: "::1",
        lastLoginOs: null,
        lastLoginOsVersion: null,
        lastLoginModel: null,
        lastLoginAppVersionName: null,
        lastLoginAppVersionCode: null
      }
    };
    
    return await this.create(superAdminData, session);
  }

  async findSuperAdminByTenantId(tenantId: string): Promise<IUser | null> {
    return await this.model.findOne({ 
      tenant: tenantId, 
      role: 'ADMIN',
      isDefault: true 
    }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteMany({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 