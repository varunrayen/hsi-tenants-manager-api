import { IAuditLog, CreateAuditLogRequest } from '../types';
import { AuditLog } from '../models';
import { BaseService } from './base-service';

export class AuditService extends BaseService<IAuditLog> {
  constructor() {
    super(AuditLog);
  }

  async logAction(request: CreateAuditLogRequest, session?: any): Promise<IAuditLog> {
    const auditData = {
      ...request,
      timestamp: new Date()
    };

    return await this.create(auditData, session);
  }

  async getAuditHistory(tenantId: string, options: {
    entityType?: string;
    entityId?: string;
    action?: string;
    performedBy?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    audits: IAuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      entityType,
      entityId,
      action,
      performedBy,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = options;

    const filter: any = { tenantId };

    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;
    if (action) filter.action = action;
    if (performedBy) {
      filter.$or = [
        { 'performedBy.userId': performedBy },
        { 'performedBy.username': performedBy },
        { 'performedBy.email': performedBy }
      ];
    }
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = startDate;
      if (endDate) filter.timestamp.$lte = endDate;
    }

    const skip = (page - 1) * limit;
    const total = await this.count(filter);
    const audits = await this.find(filter, {
      skip,
      limit,
      sort: { timestamp: -1 }
    });

    return {
      audits,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getEntityHistory(tenantId: string, entityType: string, entityId: string): Promise<IAuditLog[]> {
    return await this.find(
      { tenantId, entityType, entityId },
      { sort: { timestamp: -1 } }
    );
  }

  async getUserActions(tenantId: string, userId: string, options: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): Promise<IAuditLog[]> {
    const { startDate, endDate, limit = 50 } = options;

    const filter: any = {
      tenantId,
      'performedBy.userId': userId
    };

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = startDate;
      if (endDate) filter.timestamp.$lte = endDate;
    }

    return await this.find(filter, {
      limit,
      sort: { timestamp: -1 }
    });
  }

  async deleteAuditsByTenant(tenantId: string, session?: any): Promise<boolean> {
    return await this.deleteMany({ tenantId }, session);
  }
}