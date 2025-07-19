import { TenantService } from '../services';
import { IUseCase, UseCaseResponse, PaginationRequest, PaginationResponse } from './BaseUseCase';
import { ITenant } from '../types';

interface ListTenantsRequest extends PaginationRequest {}

export class ListTenantsUseCase implements IUseCase<ListTenantsRequest, UseCaseResponse<PaginationResponse<ITenant>>> {
  private tenantService: TenantService;

  constructor() {
    this.tenantService = new TenantService();
  }

  async execute(request: ListTenantsRequest): Promise<UseCaseResponse<PaginationResponse<ITenant>>> {
    try {
      const page = request.page || 1;
      const limit = request.limit || 10;
      const skip = (page - 1) * limit;

      const tenants = await this.tenantService.find({}, { skip, limit });
      const total = await this.tenantService.count();

      const paginationResponse: PaginationResponse<ITenant> = {
        items: tenants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };

      return {
        success: true,
        data: paginationResponse
      };
    } catch (error) {
      console.error('Error fetching tenants:', error);
      return {
        success: false,
        error: 'Failed to fetch tenants'
      };
    }
  }
} 