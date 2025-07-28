import { IRole } from '../types';
import { Role } from '../models';
import { BaseService } from './base-service';

export class RoleService extends BaseService<IRole> {
  constructor() {
    super(Role);
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