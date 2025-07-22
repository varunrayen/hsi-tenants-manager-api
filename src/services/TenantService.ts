import { ITenant } from '../types';
import { Tenant } from '../models';
import { BaseService } from './BaseService';

export class TenantService extends BaseService<ITenant> {
  constructor() {
    super(Tenant);
  }

  override async updateById(id: string, data: Partial<ITenant>): Promise<ITenant | null> {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
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
      blindReceiving: false,
      blockParentLocations: false,
      compliance: false,
      enableLocationValidation: false,
      isOutboundPlanningEnabled: false,
      isProductAliasAllowed: false,
      isProductLinkageAllowed: false,
      isSTOEnabled: false,
      maximumPalletClearanceStrategy: false,
      metricsConfig: {
        preferredDimensionUnit: ['cm'],
        preferredWeightUnit: ['kg']
      },
      moveSkuBinMappingEnabled: false,
      multiAccountIntegrationSupportEnabled: false,
      multiplePalletsAtOneLocation: false,
      overReceivingOnConsignments: false,
      processLocksOnManualBatching: false,
      requireConsignmentForPutaway: false,
      skipBatchingPreview: false,
      softAllocationOnBatching: false,
      splitOrderEnabled: false
    };
  }
} 