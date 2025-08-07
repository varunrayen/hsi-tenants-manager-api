import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    role: string;
    permissions: string[];
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  try {
    res.status(501).json({
      success: false,
      error: 'Authentication not yet implemented'
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const requireTenantManagementPermission = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const userEmail = req.headers['x-user-email'] as string;
  const userName = req.headers['x-user-name'] as string;

  if (!userEmail || !userName) {
    res.status(401).json({
      success: false,
      error: 'User authentication headers required (x-user-email, x-user-name)'
    });
    return;
  }

  const allowedEmails = [
    'dinu@hopstack.io',
    // 'varun@hopstack.io'
  ];
  
  if (!allowedEmails.includes(userEmail.toLowerCase())) {
    res.status(403).json({
      success: false,
      error: 'Insufficient permissions. Only authorized users can manage tenants.'
    });
    return;
  }

  next();
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!user.permissions.includes(permission) && !user.permissions.includes('*')) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};