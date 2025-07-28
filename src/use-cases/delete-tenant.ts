import { Types } from 'mongoose';
import DatabaseConnection from '../config/database';
import {
  TenantService,
  CustomerService,
  WarehouseService,
  UserService
} from '../services';
import { IUseCase, UseCaseResponse } from './base';

interface DeleteTenantRequest {
  id: string;
}

export class DeleteTenantUseCase implements IUseCase<DeleteTenantRequest, UseCaseResponse<null>> {
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

  async execute(request: DeleteTenantRequest): Promise<UseCaseResponse<null>> {
    const mongooseInstance = DatabaseConnection.getInstance().getConnection();
    const session = await mongooseInstance.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const { id } = request;
        
        if (!id || !Types.ObjectId.isValid(id)) {
          throw new Error('Invalid tenant ID');
        }

        const tenant = await this.tenantService.findById(id);
        
        if (!tenant) {
          throw new Error('Tenant not found');
        }

        // Delete related entities using tenant subdomain as identifier
        await this.customerService.deleteByTenantId(tenant.subdomain, session);
        await this.warehouseService.deleteByTenantId(tenant.subdomain, session);
        await this.userService.deleteByTenantId(tenant.subdomain, session);
        await this.tenantService.deleteById(id, session);

        return true;
      });

      return {
        success: true,
        message: 'Tenant deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting tenant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete tenant';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      await session.endSession();
    }
  }
}