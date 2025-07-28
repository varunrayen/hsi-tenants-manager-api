import { Document } from 'mongoose';

export interface IAuditLog extends Document {
  tenantId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  performedBy: {
    userId?: string;
    username: string;
    email?: string;
  };
  timestamp: Date;
  changes: {
    before?: any;
    after?: any;
  };
  metadata?: {
    ip?: string;
    userAgent?: string;
    source?: string;
    [key: string]: any;
  };
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  SETUP = 'SETUP'
}

export interface CreateAuditLogRequest {
  tenantId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  performedBy: {
    userId?: string;
    username: string;
    email?: string;
  };
  changes?: {
    before?: any;
    after?: any;
  };
  metadata?: {
    ip?: string;
    userAgent?: string;
    source?: string;
    [key: string]: any;
  };
}