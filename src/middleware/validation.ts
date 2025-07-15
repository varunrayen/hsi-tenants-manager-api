import { Request, Response, NextFunction } from 'express';
import { CreateTenantRequest } from '../types';

export const validateCreateTenant = (req: Request, res: Response, next: NextFunction): void => {
  const { tenant, customer, warehouse, superAdmin }: CreateTenantRequest = req.body;

  const errors: string[] = [];

  if (!tenant || !tenant.name || !tenant.domain) {
    errors.push('Tenant name and domain are required');
  }

  if (!customer || !customer.companyName || !customer.contactPerson || !customer.email) {
    errors.push('Customer company name, contact person, and email are required');
  }

  if (!warehouse || !warehouse.name || !warehouse.code) {
    errors.push('Warehouse name and code are required');
  }

  if (!superAdmin || !superAdmin.username || !superAdmin.email || !superAdmin.password) {
    errors.push('Super admin username, email, and password are required');
  }

  if (tenant?.domain && !isValidDomain(tenant.domain)) {
    errors.push('Invalid domain format');
  }

  if (customer?.email && !isValidEmail(customer.email)) {
    errors.push('Invalid customer email format');
  }

  if (superAdmin?.email && !isValidEmail(superAdmin.email)) {
    errors.push('Invalid super admin email format');
  }

  if (superAdmin?.password && !isValidPassword(superAdmin.password)) {
    errors.push('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors
    });
    return;
  }

  next();
};

export const validateUpdateTenant = (req: Request, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  if (req.body.domain && !isValidDomain(req.body.domain)) {
    errors.push('Invalid domain format');
  }

  if (req.body.email && !isValidEmail(req.body.email)) {
    errors.push('Invalid email format');
  }

  if (req.body.status && !['active', 'inactive', 'pending'].includes(req.body.status)) {
    errors.push('Invalid status value');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors
    });
    return;
  }

  next();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
};

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};