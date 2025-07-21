import { Model } from 'mongoose';
import { IUser } from '../types';
import { User } from '../models';
import { IBaseService } from './BaseService';
import { hashPassword } from '../utils/helpers';

export class UserService implements IBaseService<IUser> {
  private model: Model<IUser>;

  constructor() {
    this.model = User;
  }

  async create(data: Partial<IUser>, session?: any): Promise<IUser> {
    const user = new this.model(data);
    return await user.save({ session });
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<IUser | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<IUser[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string, session?: any): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id, { session }).exec();
    return !!result;
  }

  async deleteMany(filter: any, session?: any): Promise<boolean> {
    const result = await this.model.deleteMany(filter, { session }).exec();
    return result.deletedCount > 0;
  }

  async count(filter: any = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
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