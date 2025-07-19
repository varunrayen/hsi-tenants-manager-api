import { Model } from 'mongoose';
import { ITenant } from '../types';
import { Tenant } from '../models';
import { IBaseService } from './BaseService';

export class TenantService implements IBaseService<ITenant> {
  private model: Model<ITenant>;

  constructor() {
    this.model = Tenant;
  }

  async create(data: Partial<ITenant>, session?: any): Promise<ITenant> {
    const tenant = new this.model(data);
    return await tenant.save({ session });
  }

  async findById(id: string): Promise<ITenant | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<ITenant | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<ITenant[]> {
    const { skip, limit, sort } = options;
    let query = this.model.find(filter);
    
    if (skip !== undefined) query = query.skip(skip);
    if (limit !== undefined) query = query.limit(limit);
    if (sort) query = query.sort(sort);
    
    return await query.exec();
  }

  async updateById(id: string, data: Partial<ITenant>): Promise<ITenant | null> {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
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

  async findBySubdomain(subdomain: string): Promise<ITenant | null> {
    return await this.model.findOne({ subdomain }).exec();
  }

  getDefaultModules() {
    return [
      { name: 'Receiving', enabled: true },
      { name: 'Picking', enabled: true },
      { name: 'Packing', enabled: true },
      { name: 'Shipping', enabled: true },
      { name: 'Inventory', enabled: true },
      { name: 'Reporting', enabled: false }
    ];
  }

  getDefaultFeatures() {
    return {
      combinedPackAndPrep: false,
      combinedReceiveAndPrep: false,
      dropship: false,
      maximumPalletClearanceStrategy: false,
      multiplePickingStrategies: false,
      optimizedBatching: false,
      rateShopping: false
    };
  }

  getDefaultSettings() {
    return {
      activities: {
        packing: {
          boxSelection: false
        },
        receiving: {
          putawayBinLocation: false,
          poEnabled: false
        }
      },
      allowConstituentsPickingForBundleOrders: false,
      backOrderEnabled: false,
      blockParentLocations: false,
      enableLocationValidation: false,
      isSTOEnabled: false,
      metricsConfig: {
        preferredDimensionUnit: ['cm'],
        preferredWeightUnit: ['kg']
      },
      multiAccountIntegrationSupportEnabled: false,
      isOutboundPlanningEnabled: false
    };
  }
} 