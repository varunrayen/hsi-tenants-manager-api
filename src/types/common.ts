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

export interface TenantSettings {
  timezone: string;
  currency: string;
  language: string;
  features: string[];
}

export type TenantStatus = 'active' | 'inactive' | 'pending';
export type UserRole = 'super_admin' | 'admin' | 'user';