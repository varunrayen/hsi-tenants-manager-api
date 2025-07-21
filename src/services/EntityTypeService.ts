import { Model } from 'mongoose';
import { IEntityType } from '../types';
import { EntityType } from '../models';
import { IBaseService } from './BaseService';

export class EntityTypeService implements IBaseService<IEntityType> {
  private model: Model<IEntityType>;

  constructor() {
    this.model = EntityType;
  }

  async create(data: Partial<IEntityType>, session?: any): Promise<IEntityType> {
    const entityType = new this.model(data);
    return await entityType.save({ session });
  }

  async findById(id: string): Promise<IEntityType | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<IEntityType | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<IEntityType[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<IEntityType>): Promise<IEntityType | null> {
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

  async findByTenantId(tenantId: string): Promise<IEntityType[]> {
    return await this.model.find({ tenant: tenantId }).exec();
  }

  async deleteByTenantId(tenantId: string, session?: any): Promise<boolean> {
    const result = await this.model.deleteMany({ tenant: tenantId }, { session }).exec();
    return result.deletedCount > 0;
  }
}