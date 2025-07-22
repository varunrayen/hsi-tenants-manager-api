import { Types } from 'mongoose';
import { TenantService } from '../services';
import { IUseCase, UseCaseResponse } from './base';

interface UpdateTenantRequest {
  id: string;
  updateData: any;
}

export class UpdateTenantUseCase implements IUseCase<UpdateTenantRequest, UseCaseResponse<null>> {
  private tenantService: TenantService;

  constructor() {
    this.tenantService = new TenantService();
  }

  async execute(request: UpdateTenantRequest): Promise<UseCaseResponse<null>> {
    try {
      const { id, updateData } = request;
      
      if (!id || !Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid tenant ID'
        };
      }

      const result = await this.tenantService.updateById(id, updateData);

      if (!result) {
        return {
          success: false,
          error: 'Tenant not found'
        };
      }

      return {
        success: true,
        message: 'Tenant updated successfully'
      };
    } catch (error) {
      console.error('Error updating tenant:', error);
      return {
        success: false,
        error: 'Failed to update tenant'
      };
    }
  }
}