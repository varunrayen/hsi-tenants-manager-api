import { Document } from 'mongoose';

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