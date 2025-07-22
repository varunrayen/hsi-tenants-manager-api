import { CustomerService, WarehouseService, UserService, EntityTypeService } from '../services';
import { IUseCase, UseCaseResponse } from './base';
import { ICustomer, IWarehouse, IUser, IEntityType } from '../types';

interface GetTenantOnboardingProgressRequest {
  tenantId: string;
}

interface OnboardingProgressData {
  customer: ICustomer | null;
  warehouse: IWarehouse | null;
  superAdmin: IUser | null;
  entityTypes: IEntityType[];
  isComplete: boolean;
}

export class GetTenantOnboardingProgressUseCase implements IUseCase<GetTenantOnboardingProgressRequest, UseCaseResponse<OnboardingProgressData>> {
  private customerService: CustomerService;
  private warehouseService: WarehouseService;
  private userService: UserService;
  private entityTypeService: EntityTypeService;

  constructor() {
    this.customerService = new CustomerService();
    this.warehouseService = new WarehouseService();
    this.userService = new UserService();
    this.entityTypeService = new EntityTypeService();
  }

  async execute(request: GetTenantOnboardingProgressRequest): Promise<UseCaseResponse<OnboardingProgressData>> {
    try {
      const { tenantId } = request;

      // Find default customer for the tenant
      const customer = await this.customerService.findOne({
        tenant: tenantId,
        isDefault: true
      });

      // Find default warehouse for the tenant
      const warehouse = await this.warehouseService.findOne({
        tenant: tenantId,
        isDefault: true
      });

      // Find super admin user for the tenant
      const superAdmin = await this.userService.findSuperAdminByTenantId(tenantId);

      // Find entity types (roles) for the tenant
      const entityTypes = await this.entityTypeService.findByTenantId(tenantId);

      // Remove password from super admin response for security
      const superAdminResponse = superAdmin ? {
        ...superAdmin.toObject(),
        password: undefined
      } : null;

      // Check if onboarding is complete (should have at least 2 entity types: ADMIN and ASSOCIATE)
      const hasRequiredEntityTypes = entityTypes.length >= 2 &&
        entityTypes.some(et => et.name === 'ADMIN') &&
        entityTypes.some(et => et.name === 'ASSOCIATE');

      const isComplete = !!(customer && warehouse && superAdmin && hasRequiredEntityTypes);

      return {
        success: true,
        data: {
          customer,
          warehouse,
          superAdmin: superAdminResponse,
          entityTypes,
          isComplete
        }
      };
    } catch (error) {
      console.error('Error getting tenant onboarding progress:', error);
      return {
        success: false,
        error: 'Failed to get tenant onboarding progress'
      };
    }
  }
}