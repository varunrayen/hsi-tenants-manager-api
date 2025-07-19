import { Model } from 'mongoose';
import { IRole } from '../types';
import { Role } from '../models';
import { IBaseService } from './BaseService';

export class RoleService implements IBaseService<IRole> {
  private model: Model<IRole>;

  constructor() {
    this.model = Role;
  }

  async create(data: Partial<IRole>, session?: any): Promise<IRole> {
    const role = new this.model(data);
    return await role.save({ session });
  }

  async findById(id: string): Promise<IRole | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<IRole | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<IRole[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<IRole>): Promise<IRole | null> {
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

  async createDefaultRoles(tenantId: string, session?: any): Promise<IRole[]> {
    const defaultRoles = [
      {
        tenantId,
        name: 'Admin',
        description: 'Administrator role with full access',
        permissions: ['manage_users', 'manage_inventory', 'view_reports', 'manage_settings'],
        isSystemRole: true
      },
      {
        tenantId,
        name: 'Associate',
        description: 'Basic user role with limited access',
        permissions: ['view_inventory', 'update_inventory'],
        isSystemRole: true
      }
    ];

    return await this.model.insertMany(defaultRoles, { session });
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteMany({ tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 