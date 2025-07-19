import { Model } from 'mongoose';
import { ICustomer } from '../types';
import { Customer } from '../models';
import { IBaseService } from './BaseService';

export class CustomerService implements IBaseService<ICustomer> {
  private model: Model<ICustomer>;

  constructor() {
    this.model = Customer;
  }

  async create(data: Partial<ICustomer>, session?: any): Promise<ICustomer> {
    const customer = new this.model(data);
    return await customer.save({ session });
  }

  async findById(id: string): Promise<ICustomer | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<ICustomer | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<ICustomer[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<ICustomer>): Promise<ICustomer | null> {
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

  async findByTenantId(tenantId: string): Promise<ICustomer | null> {
    return await this.model.findOne({ tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteOne({ tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 