import mongoose from 'mongoose';
import DatabaseConnection from '../config/database';
import { TenantService, AuditService } from '../services';
import { IUseCase, UseCaseResponse } from './base';
import { AuditAction } from '../types';

interface CreateTenantDirectRequest {
  region?: string;
  environment?: string;
  performedBy?: {
    username: string;
    email?: string;
  };
  [key: string]: any; // Direct tenant data
}

interface CreateTenantDirectResponse {
  tenantId: string;
  tenant: any;
  customer: null;
  warehouse: null;
  superAdmin: null;
}

export class CreateTenantDirectUseCase implements IUseCase<CreateTenantDirectRequest, UseCaseResponse<CreateTenantDirectResponse>> {
  private tenantService: TenantService;
  private auditService: AuditService;

  constructor() {
    this.tenantService = new TenantService();
    this.auditService = new AuditService();
  }

  async execute(request: CreateTenantDirectRequest): Promise<UseCaseResponse<CreateTenantDirectResponse>> {
    const mongooseInstance = DatabaseConnection.getInstance().getConnection();
    const session = await mongooseInstance.startSession();

    try {
      const result = await session.withTransaction(async () => {
        // Prepare tenant data with defaults
        const tenantData = {
          ...request,
          active: request.active !== undefined ? request.active : false,
          enabledSimulations: request.enabledSimulations !== undefined ? request.enabledSimulations : true,
          typeOfCustomer: request.typeOfCustomer || ['3PL'],
          features: { ...this.tenantService.getDefaultFeatures(), ...request.features },
          modules: request.modules || this.tenantService.getDefaultModules(),
          settings: { ...this.tenantService.getDefaultSettings(), ...request.settings },
          integrations: request.integrations || []
        };

        const tenantDoc = await this.tenantService.create(tenantData, session);

        // Log audit entry for tenant creation
        await this.auditService.logAction({
          tenantId: tenantDoc.id,
          action: AuditAction.CREATE,
          entityType: 'Tenant',
          entityId: tenantDoc.id,
          performedBy: request.performedBy || {
            username: 'system'
          },
          changes: {
            after: tenantData
          },
          metadata: {
            source: 'direct-tenant-creation'
          }
        }, session);

        return {
          tenantId: tenantDoc.id,
          tenant: tenantDoc,
          customer: null,
          warehouse: null,
          superAdmin: null
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