import { IWarehouse } from '../types';
import { Warehouse, WarehouseSchema } from '../models';
import { BaseService } from './base-service';
import { Connection } from 'mongoose';

export class WarehouseService extends BaseService<IWarehouse> {
  constructor(connection?: Connection) {
    if (connection) {
      // Use the regional connection to get the model
      const regionalModel = connection.model<IWarehouse>('Warehouse', WarehouseSchema);
      super(regionalModel);
    } else {
      // Use the default model
      super(Warehouse);
    }
  }

  async findByTenantId(tenantId: string): Promise<IWarehouse | null> {
    return await this.model.findOne({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteOne({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 