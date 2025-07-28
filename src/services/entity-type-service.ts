import { IEntityType } from '../types';
import { EntityType } from '../models';
import { BaseService } from './base-service';

export class EntityTypeService extends BaseService<IEntityType> {
  constructor() {
    super(EntityType);
  }

  async findByTenantId(tenantId: string): Promise<IEntityType[]> {
    return await this.model.find({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteMany({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
}