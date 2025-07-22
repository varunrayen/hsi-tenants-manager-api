import { Types } from 'mongoose';
import {
  TenantService,
  CustomerService,
  WarehouseService,
  UserService
} from '../services';
import { IUseCase, UseCaseResponse } from './base';

interface GetTenantRequest {
  id: string;
}

interface GetTenantResponse {
  tenant: any;
  customer: any;
  warehouse: any;
  superAdmin: any;
}

export class GetTenantUseCase implements IUseCase<GetTenantRequest, UseCaseResponse<GetTenantResponse>> {
  private tenantService: TenantService;
  private customerService: CustomerService;
  private warehouseService: WarehouseService;
  private userService: UserService;

  constructor() {
    this.tenantService = new TenantService();
    this.customerService = new CustomerService();
    this.warehouseService = new WarehouseService();
    this.userService = new UserService();
  }

  async execute(request: GetTenantRequest): Promise<UseCaseResponse<GetTenantResponse>> {
    try {
      const { id } = request;
      
      if (!id || !Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid tenant ID'
        };
      }

      const tenant = await this.tenantService.findById(id);
      
      if (!tenant) {
        return {
          success: false,
          error: 'Tenant not found'
        };
      }

      // Find related entities using tenant subdomain as identifier
      const customer = await this.customerService.findByTenantId(tenant.subdomain);
      const warehouse = await this.warehouseService.findByTenantId(tenant.subdomain);
      const superAdmin = await this.userService.findSuperAdminByTenantId(tenant.subdomain);

      return {
        success: true,
        data: {
          tenant,
          customer,
          warehouse,
          superAdmin: superAdmin ? { ...superAdmin.toObject(), password: undefined } : null
        }
      };
    } catch (error) {
      console.error('Error fetching tenant:', error);
      return {
        success: false,
        error: 'Failed to fetch tenant'
      };
    }
  }
}