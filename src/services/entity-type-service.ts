import { IEntityType } from '../types';
import { EntityType, EntityTypeSchema } from '../models';
import { BaseService } from './base-service';
import { Connection } from 'mongoose';

export class EntityTypeService extends BaseService<IEntityType> {
  constructor(connection?: Connection) {
    if (connection) {
      // Use the regional connection to get the model
      const regionalModel = connection.model<IEntityType>('EntityType', EntityTypeSchema);
      super(regionalModel);
    } else {
      // Use the default model
      super(EntityType);
    }
  }

  async findByTenantId(tenantId: string): Promise<IEntityType[]> {
    return await this.model.find({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteMany({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
}