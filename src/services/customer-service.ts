import { ICustomer } from '../types';
import { Customer } from '../models';
import { BaseService } from './base-service';

export class CustomerService extends BaseService<ICustomer> {
  constructor() {
    super(Customer);
  }

  async findByTenantId(tenantId: string): Promise<ICustomer | null> {
    return await this.model.findOne({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteOne({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 