import { IWarehouse } from '../types';
import { Warehouse } from '../models';
import { BaseService } from './base-service';

export class WarehouseService extends BaseService<IWarehouse> {
  constructor() {
    super(Warehouse);
  }

  async findByTenantId(tenantId: string): Promise<IWarehouse | null> {
    return await this.model.findOne({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteOne({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 