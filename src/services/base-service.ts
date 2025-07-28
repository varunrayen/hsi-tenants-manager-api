import { Document, Model } from 'mongoose';

export interface IBaseService<T extends Document> {
  create(data: Partial<T>, session?: any): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: any): Promise<T | null>;
  find(filter: any, options?: any): Promise<T[]>;
  updateById(id: string, data: Partial<T>): Promise<T | null>;
  deleteById(id: string, session?: any): Promise<boolean>;
  deleteMany(filter: any, session?: any): Promise<boolean>;
  count(filter?: any): Promise<number>;
}

export abstract class BaseService<T extends Document> implements IBaseService<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>, session?: any): Promise<T> {
    const document = new this.model(data);
    return await document.save({ session });
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<T[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
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
} 