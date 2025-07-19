import { Request, Response } from 'express';
import {
  CreateTenantUseCase,
  CreateTenantDirectUseCase,
  GetTenantUseCase,
  UpdateTenantUseCase,
  DeleteTenantUseCase,
  ListTenantsUseCase
} from '../use-cases';

export class TenantController {
  private createTenantUseCase: CreateTenantUseCase;
  private createTenantDirectUseCase: CreateTenantDirectUseCase;
  private getTenantUseCase: GetTenantUseCase;
  private updateTenantUseCase: UpdateTenantUseCase;
  private deleteTenantUseCase: DeleteTenantUseCase;
  private listTenantsUseCase: ListTenantsUseCase;

  constructor() {
    this.createTenantUseCase = new CreateTenantUseCase();
    this.createTenantDirectUseCase = new CreateTenantDirectUseCase();
    this.getTenantUseCase = new GetTenantUseCase();
    this.updateTenantUseCase = new UpdateTenantUseCase();
    this.deleteTenantUseCase = new DeleteTenantUseCase();
    this.listTenantsUseCase = new ListTenantsUseCase();
  }

  public createTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if the request body contains nested structure or direct tenant data
      const isNestedStructure = req.body.tenant !== undefined;
      
      let result;
      if (isNestedStructure) {
        result = await this.createTenantUseCase.execute(req.body);
      } else {
        result = await this.createTenantDirectUseCase.execute(req.body);
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

      const result = await this.updateTenantUseCase.execute({
        id,
        updateData: req.body
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
}