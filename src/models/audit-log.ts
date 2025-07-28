import { Schema, model } from 'mongoose';
import { IAuditLog, AuditAction } from '../types';

const auditLogSchema = new Schema<IAuditLog>({
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: Object.values(AuditAction),
    required: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    index: true
  },
  entityId: {
    type: String,
    required: true,
    index: true
  },
  performedBy: {
    userId: {
      type: String,
      required: false
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  changes: {
    before: {
      type: Schema.Types.Mixed,
      required: false
    },
    after: {
      type: Schema.Types.Mixed,
      required: false
    },
    modified: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  metadata: {
    type: Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true,
  collection: 'audit_logs'
});

// Compound indexes for efficient queries
auditLogSchema.index({ tenantId: 1, timestamp: -1 });
auditLogSchema.index({ tenantId: 1, entityType: 1, entityId: 1 });
auditLogSchema.index({ tenantId: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ 'performedBy.userId': 1, timestamp: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);