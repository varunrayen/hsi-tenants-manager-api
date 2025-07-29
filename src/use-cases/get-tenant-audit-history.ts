import { IUseCase } from './base';
import { AuditService } from '../services/audit-service';
import { IAuditLog } from '../types';

export class GetTenantAuditHistory implements IUseCase<string, IAuditLog[]> {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  async execute(tenantId: string): Promise<IAuditLog[]> {
    const { audits } = await this.auditService.getAuditHistory(tenantId);
    
    // Filter out 'before' and 'after' fields from changes object
    const filteredAudits = audits.map(audit => {
      const auditObj = audit.toObject ? audit.toObject() : audit;
      
      if (auditObj.changes) {
        const { before, after, ...filteredChanges } = auditObj.changes;
        auditObj.changes = filteredChanges;
      }
      
      return auditObj;
    });
    
    return filteredAudits;
  }
}
