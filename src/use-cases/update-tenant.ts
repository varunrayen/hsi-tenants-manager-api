import { Types } from 'mongoose';
import { TenantService, AuditService } from '../services';
import { IUseCase, UseCaseResponse } from './base';
import { AuditAction } from '../types';

interface UpdateTenantRequest {
  id: string;
  updateData: any;
  performedBy?: {
    userId?: string;
    username: string;
    email?: string;
  };
}

export class UpdateTenantUseCase implements IUseCase<UpdateTenantRequest, UseCaseResponse<null>> {
  private tenantService: TenantService;
  private auditService: AuditService;

  constructor() {
    this.tenantService = new TenantService();
    this.auditService = new AuditService();
  }

  async execute(request: UpdateTenantRequest): Promise<UseCaseResponse<null>> {
    try {
      const { id, updateData, performedBy } = request;

      console.log('updateData', updateData);
      
      if (!id || !Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid tenant ID'
        };
      }

      // Get the current tenant data for audit log
      const existingTenant = await this.tenantService.findById(id);
      if (!existingTenant) {
        return {
          success: false,
          error: 'Tenant not found'
        };
      }

      const result = await this.tenantService.updateById(id, updateData);

      if (!result) {
        return {
          success: false,
          error: 'Tenant not found'
        };
      }

      // Log audit entry for tenant update
      await this.auditService.logAction({
        tenantId: id,
        action: AuditAction.UPDATE,
        entityType: 'Tenant',
        entityId: id,
        performedBy: performedBy || {
          username: 'system'
        },
        changes: {
          before: existingTenant.toObject(),
          after: result.toObject()
        },
        metadata: {
          source: 'tenant-update'
        }
      });

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