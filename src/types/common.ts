// Common types used across the application

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingInfo {
  planType: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: string;
}

export interface TenantModule {
  enabled: boolean;
  name: string;
}

export interface TenantFeatures {
  combinedPackAndPrep: boolean;
  combinedReceiveAndPrep: boolean;
  dropship: boolean;
  maximumPalletClearanceStrategy: boolean;
  multiplePickingStrategies: boolean;
  optimizedBatching: boolean;
  rateShopping: boolean;
}

export interface TenantProfile {
  businessAddress: string;
  businessName: string;
}

export interface ActivitySettings {
  packing: {
    boxSelection: boolean;
  };
  receiving: {
    putawayBinLocation: boolean;
    poEnabled: boolean;
  };
}

export interface MetricsConfig {
  preferredDimensionUnit: string[];
  preferredWeightUnit: string[];
}

export interface TenantSettings {
  activities: ActivitySettings;
  allowConstituentsPickingForBundleOrders: boolean;
  backOrderEnabled: boolean;
  blindReceiving: boolean;
  blockParentLocations: boolean;
  compliance: boolean;
  enableLocationValidation: boolean;
  isOutboundPlanningEnabled: boolean;
  isProductAliasAllowed: boolean;
  isProductLinkageAllowed: boolean;
  isSTOEnabled: boolean;
  maximumPalletClearanceStrategy: boolean;
  metricsConfig: MetricsConfig;
  moveSkuBinMappingEnabled: boolean;
  multiAccountIntegrationSupportEnabled: boolean;
  multiplePalletsAtOneLocation: boolean;
  overReceivingOnConsignments: boolean;
  processLocksOnManualBatching: boolean;
  requireConsignmentForPutaway: boolean;
  skipBatchingPreview: boolean;
  softAllocationOnBatching: boolean;
  splitOrderEnabled: boolean;
}

export type TenantStatus = 'active' | 'inactive' | 'pending';
export type UserRole = 'super_admin' | 'admin' | 'user';
export type CustomerType = '3PL' | 'Brand';