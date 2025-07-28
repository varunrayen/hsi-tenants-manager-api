import mongoose from 'mongoose';
import DatabaseConnection from '../config/database';
import { CreateTenantRequest, AuditAction } from '../types';
import {
  TenantService,
  CustomerService,
  WarehouseService,
  UserService,
  AuditService
} from '../services';
import { IUseCase, UseCaseResponse } from './base';

interface CreateTenantResponse {
  tenantId: string;
  tenant: any;
  customer: any;
  warehouse: any;
  superAdmin: any;
}

export class CreateTenantUseCase implements IUseCase<CreateTenantRequest, UseCaseResponse<CreateTenantResponse>> {
  private tenantService: TenantService;
  private customerService: CustomerService;
  private warehouseService: WarehouseService;
  private userService: UserService;
  private auditService: AuditService;

  constructor() {
    this.tenantService = new TenantService();
    this.customerService = new CustomerService();
    this.warehouseService = new WarehouseService();
    this.userService = new UserService();
    this.auditService = new AuditService();
  }

  async execute(request: CreateTenantRequest): Promise<UseCaseResponse<CreateTenantResponse>> {
    const mongooseInstance = DatabaseConnection.getInstance().getConnection();
    const session = await mongooseInstance.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const { tenant, customer, warehouse, superAdmin } = request;
        const tenantId = tenant.subdomain;

        let customerDoc, warehouseDoc, userDoc;

        console.log("customer", customer);

        // Create warehouse if provided (create warehouse first to get its ID)
        if (warehouse) {
          warehouseDoc = await this.warehouseService.create({
            name: warehouse.name,
            code: warehouse.code,
            isDefault: true,
            active: true,
            tenant: tenantId,
            location: "Default",
            splitOrdersEnabled: null,
            typeOfWarehouse: ["D2C", "B2B"],
            address: {
              email: "warehouse@company.com",
              phone: "1234567890",
              zip: warehouse.address?.zipCode || "00000",
              city: warehouse.address?.city || "Default City",
              country: warehouse.address?.country || "US",
              line1: warehouse.address?.street || "Default Address"
            },
            storageTypes: ["Ambient"]
          }, session);
        }

        // Create customer if provided
        if (customer) {
          customerDoc = await this.customerService.create({
            name: customer.companyName || "Default",
            code: "DEF",
            tenant: tenantId,
            isDefault: true,
            warehouses: customer.warehouses || [],
            currency: "$",
            currentBillingProfile: null,
            active: true,
            metaData: {
              ticket: "HOP-5833"
            },
            settings: {
              workflows: {
                inbound: {
                  enabled: true
                }
              }
            }
          }, session);
        }

        // Create super admin if provided
        if (superAdmin) {
          userDoc = await this.userService.create({
            name: "Super Admin",
            username: superAdmin.username || "super.admin",
            password: superAdmin.password || "$2a$10$muDypVeYS0APX0/XG/vELO/xrew5H51kB17YcgEtWT5QW7.MWwCEa",
            role: "ADMIN",
            hopstackModules: null,
            permissions: [
              { route: "/orders", readable: true, writable: true },
              { route: "/warehouses", readable: true, writable: true },
              { route: "/customers", readable: true, writable: true },
              { route: "/users", readable: true, writable: true }
            ],
            pagePreferences: [
              { route: "/orders", visible: true },
              { route: "/customers", visible: true },
              { route: "/users", visible: true }
            ],
            tenant: tenantId,
            isDefault: true,
            email: superAdmin.email || "admin@company.com",
            isEmailVerified: true,
            termsAndConditionsAccepted: true,
            activated: true,
            meta: {
              lastLogin: Date.now(),
              lastLoginPlatform: "web",
              lastLoginIp: "::1",
              lastLoginOs: null,
              lastLoginOsVersion: null,
              lastLoginModel: null,
              lastLoginAppVersionName: null,
              lastLoginAppVersionCode: null
            }
          }, session);
        }


        // Prepare tenant data with defaults
        const tenantData = {
          name: tenant.name,
          subdomain: tenant.subdomain,
          active: false,
          apiGateway: tenant.apiGateway,
          cubeService: tenant.cubeService,
          socketService: tenant.socketService,
          enabledSimulations: tenant.enabledSimulations !== undefined ? tenant.enabledSimulations : true,
          typeOfCustomer: tenant.typeOfCustomer || ['3PL'],
          profile: tenant.profile,
          features: { ...this.tenantService.getDefaultFeatures(), ...tenant.features },
          modules: tenant.modules || this.tenantService.getDefaultModules(),
          settings: { ...this.tenantService.getDefaultSettings(), ...tenant.settings },
          integrations: tenant.integrations || []
        };

        const tenantDoc = await this.tenantService.create(tenantData, session);

        // Log audit entry for tenant creation
        await this.auditService.logAction({
          tenantId: tenantDoc.id,
          action: AuditAction.CREATE,
          entityType: 'Tenant',
          entityId: tenantDoc.id,
          performedBy: request.performedBy || {
            username: 'system',
            email: superAdmin?.email
          },
          changes: {
            after: tenantData
          },
          metadata: {
            source: 'tenant-creation-flow'
          }
        }, session);

        return {
          tenantId: tenantDoc.id,
          tenant: tenantDoc,
          customer: customerDoc || null,
          warehouse: warehouseDoc || null,
          superAdmin: userDoc ? { ...userDoc.toObject(), password: undefined } : null
        };
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error creating tenant:', error);
      return {
        success: false,
        error: 'Failed to create tenant'
      };
    } finally {
      await session.endSession();
    }
  }
}