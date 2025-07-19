import { Request, Response, NextFunction } from 'express';
import { CreateTenantRequest } from '../types';

export const validateCreateTenant = (req: Request, res: Response, next: NextFunction): void => {
  // Check if the request body contains nested structure or direct tenant data
  const isNestedStructure = req.body.tenant !== undefined;
  
  let tenant, customer, warehouse, superAdmin;
  
  if (isNestedStructure) {
    ({ tenant, customer, warehouse, superAdmin } = req.body as CreateTenantRequest);
  } else {
    // If sending tenant data directly, treat the entire body as tenant data
    tenant = req.body;
    customer = undefined;
    warehouse = undefined;
    superAdmin = undefined;
  }

  const errors: string[] = [];

  if (!tenant || !tenant.name || !tenant.subdomain) {
    errors.push('Tenant name and subdomain are required');
  }

  if (!tenant.apiGateway || !tenant.cubeService || !tenant.socketService) {
    errors.push('Tenant API gateway, cube service, and socket service URLs are required');
  }

  if (!tenant.profile || !tenant.profile.businessName || !tenant.profile.businessAddress) {
    errors.push('Tenant business profile information is required');
  }

  // Only validate customer, warehouse, and superAdmin if they are provided in nested structure
  if (isNestedStructure) {
    if (!customer || !customer.companyName || !customer.contactPerson || !customer.email) {
      errors.push('Customer company name, contact person, and email are required');
    }

    if (!warehouse || !warehouse.name || !warehouse.code) {
      errors.push('Warehouse name and code are required');
    }

    if (!superAdmin || !superAdmin.username || !superAdmin.email || !superAdmin.password) {
      errors.push('Super admin username, email, and password are required');
    }
  }

  if (tenant?.subdomain && !isValidSubdomain(tenant.subdomain)) {
    errors.push('Invalid subdomain format');
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

  if (req.body.subdomain && !isValidSubdomain(req.body.subdomain)) {
    errors.push('Invalid subdomain format');
  }

  if (req.body.active !== undefined && typeof req.body.active !== 'boolean') {
    errors.push('Active status must be a boolean value');
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

const isValidSubdomain = (subdomain: string): boolean => {
  const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return subdomainRegex.test(subdomain);
};

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};