import { ICustomer } from '../types';
import { Customer, CustomerSchema } from '../models';
import { BaseService } from './base-service';
import { Connection } from 'mongoose';

export class CustomerService extends BaseService<ICustomer> {
  constructor(connection?: Connection) {
    if (connection) {
      // Use the regional connection to get the model
      const regionalModel = connection.model<ICustomer>('Customer', CustomerSchema);
      super(regionalModel);
    } else {
      // Use the default model
      super(Customer);
    }
  }

  async findByTenantId(tenantId: string): Promise<ICustomer | null> {
    return await this.model.findOne({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteOne({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 