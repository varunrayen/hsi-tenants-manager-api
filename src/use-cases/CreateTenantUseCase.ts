import mongoose from 'mongoose';
import DatabaseConnection from '../config/database';
import { CreateTenantRequest } from '../types';
import { 
  TenantService, 
  CustomerService, 
  WarehouseService, 
  UserService, 
  RoleService 
} from '../services';
import { IUseCase, UseCaseResponse } from './BaseUseCase';

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
  private roleService: RoleService;

  constructor() {
    this.tenantService = new TenantService();
    this.customerService = new CustomerService();
    this.warehouseService = new WarehouseService();
    this.userService = new UserService();
    this.roleService = new RoleService();
  }

  async execute(request: CreateTenantRequest): Promise<UseCaseResponse<CreateTenantResponse>> {
    const mongooseInstance = DatabaseConnection.getInstance().getConnection();
    const session = await mongooseInstance.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const { tenant, customer, warehouse, superAdmin } = request;
        const tenantId = tenant.subdomain;

        let customerDoc, warehouseDoc, userDoc;

        // Create customer if provided
        if (customer) {
          customerDoc = await this.customerService.create({
            tenantId,
            companyName: customer.companyName,
            contactPerson: customer.contactPerson,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            billingInfo: customer.billingInfo
          }, session);
        }

        // Create warehouse if provided
        if (warehouse) {
          warehouseDoc = await this.warehouseService.create({
            tenantId,
            name: warehouse.name,
            code: warehouse.code,
            address: warehouse.address,
            manager: warehouse.manager,
            capacity: warehouse.capacity,
            isActive: true
          }, session);
        }

        // Create super admin if provided
        if (superAdmin) {
          userDoc = await this.userService.createSuperAdmin(tenantId, superAdmin, session);
        }

        // Create default roles if we have a superAdmin
        if (superAdmin) {
          await this.roleService.createDefaultRoles(tenantId, session);
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