import { Request, Response } from 'express';
import {
  CreateTenantDirectUseCase,
  CreateTenantUseCase,
  DeleteTenantUseCase,
  GetTenantOnboardingProgressUseCase,
  GetTenantUseCase,
  ListTenantsUseCase,
  SetupDefaultCustomerUseCase,
  SetupDefaultEntityTypesUseCase,
  SetupDefaultSuperAdminUseCase,
  SetupDefaultWarehouseUseCase,
  UpdateTenantUseCase
} from '../use-cases';

export class TenantController {
  private createTenantUseCase: CreateTenantUseCase;
  private createTenantDirectUseCase: CreateTenantDirectUseCase;
  private getTenantUseCase: GetTenantUseCase;
  private updateTenantUseCase: UpdateTenantUseCase;
  private deleteTenantUseCase: DeleteTenantUseCase;
  private listTenantsUseCase: ListTenantsUseCase;
  private setupDefaultWarehouseUseCase: SetupDefaultWarehouseUseCase;
  private setupDefaultCustomerUseCase: SetupDefaultCustomerUseCase;
  private setupDefaultSuperAdminUseCase: SetupDefaultSuperAdminUseCase;
  private getTenantOnboardingProgressUseCase: GetTenantOnboardingProgressUseCase;
  private setupDefaultEntityTypesUseCase: SetupDefaultEntityTypesUseCase;

  constructor() {
    this.createTenantUseCase = new CreateTenantUseCase();
    this.createTenantDirectUseCase = new CreateTenantDirectUseCase();
    this.getTenantUseCase = new GetTenantUseCase();
    this.updateTenantUseCase = new UpdateTenantUseCase();
    this.deleteTenantUseCase = new DeleteTenantUseCase();
    this.listTenantsUseCase = new ListTenantsUseCase();
    this.setupDefaultWarehouseUseCase = new SetupDefaultWarehouseUseCase();
    this.setupDefaultCustomerUseCase = new SetupDefaultCustomerUseCase();
    this.setupDefaultSuperAdminUseCase = new SetupDefaultSuperAdminUseCase();
    this.getTenantOnboardingProgressUseCase = new GetTenantOnboardingProgressUseCase();
    this.setupDefaultEntityTypesUseCase = new SetupDefaultEntityTypesUseCase();
  }

  public createTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract user info from headers for audit logging
      const userEmail = req.headers['x-user-email'] as string;
      const userName = req.headers['x-user-name'] as string;
      
      // Check if the request body contains nested structure or direct tenant data
      const isNestedStructure = req.body.tenant !== undefined;
      
      let result;
      if (isNestedStructure) {
        // Add user info to request for audit logging
        const requestWithUser = {
          ...req.body,
          performedBy: {
            username: userName || 'unknown',
            email: userEmail
          }
        };
        result = await this.createTenantUseCase.execute(requestWithUser);
      } else {
        // Add user info to request for audit logging
        const requestWithUser = {
          ...req.body,
          performedBy: {
            username: userName || 'unknown',
            email: userEmail
          }
        };
        result = await this.createTenantDirectUseCase.execute(requestWithUser);
      }

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in createTenant controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getAllTenants = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.listTenantsUseCase.execute({ page, limit });

      if (result.success) {
        res.json({
          success: true,
          data: {
            tenants: result.data?.items,
            pagination: result.data?.pagination
          }
        });
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAllTenants controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getTenantById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.getTenantUseCase.execute({ id });

      if (result.success) {
        res.json(result);
      } else {
        const statusCode = result.error === 'Invalid tenant ID' ? 400 : 
                         result.error === 'Tenant not found' ? 404 : 500;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Error in getTenantById controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public updateTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      // Extract user info from headers for audit logging
      const userEmail = req.headers['x-user-email'] as string;
      const userName = req.headers['x-user-name'] as string;

      const result = await this.updateTenantUseCase.execute({
        id,
        updateData: req.body,
        performedBy: {
          username: userName || 'unknown',
          email: userEmail
        }
      });

      if (result.success) {
        res.json(result);
      } else {
        const statusCode = result.error === 'Invalid tenant ID' ? 400 : 
                         result.error === 'Tenant not found' ? 404 : 500;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Error in updateTenant controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public deleteTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.deleteTenantUseCase.execute({ id });

      if (result.success) {
        res.json(result);
      } else {
        const statusCode = result.error === 'Invalid tenant ID' ? 400 : 
                         result.error === 'Tenant not found' ? 404 : 500;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Error in deleteTenant controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public setupDefaultWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      
      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.setupDefaultWarehouseUseCase.execute({ tenantId });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in setupDefaultWarehouse controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public setupDefaultCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      
      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.setupDefaultCustomerUseCase.execute({ tenantId });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in setupDefaultCustomer controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public setupDefaultSuperAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      
      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.setupDefaultSuperAdminUseCase.execute({ tenantId });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in setupDefaultSuperAdmin controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getTenantOnboardingProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      
      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.getTenantOnboardingProgressUseCase.execute({ tenantId });

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getTenantOnboardingProgress controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public setupDefaultEntityTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      
      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: 'Tenant ID is required'
        });
        return;
      }

      const result = await this.setupDefaultEntityTypesUseCase.execute({ tenantId });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in setupDefaultEntityTypes controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}