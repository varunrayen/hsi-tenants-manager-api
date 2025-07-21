import { Model } from 'mongoose';
import { IWarehouse } from '../types';
import { Warehouse } from '../models';
import { IBaseService } from './BaseService';

export class WarehouseService implements IBaseService<IWarehouse> {
  private model: Model<IWarehouse>;

  constructor() {
    this.model = Warehouse;
  }

  async create(data: Partial<IWarehouse>, session?: any): Promise<IWarehouse> {
    const warehouse = new this.model(data);
    return await warehouse.save({ session });
  }

  async findById(id: string): Promise<IWarehouse | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<IWarehouse | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<IWarehouse[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<IWarehouse>): Promise<IWarehouse | null> {
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

  async findByTenantId(tenantId: string): Promise<IWarehouse | null> {
    return await this.model.findOne({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteOne({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
} 