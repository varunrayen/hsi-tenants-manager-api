import { Request, Response } from 'express';
import { Types } from 'mongoose';
import DatabaseConnection from '../config/database';
import { CreateTenantRequest } from '../types';
import { Tenant, Customer, Warehouse, User, Role } from '../models';
import { hashPassword } from '../utils/helpers';

export class TenantController {
  constructor() {
    // Database connection is handled in app.ts
  }

  public createTenant = async (req: Request, res: Response): Promise<void> => {
    const mongoose = DatabaseConnection.getInstance().getConnection();
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { tenant, customer, warehouse, superAdmin }: CreateTenantRequest = req.body;
        
        // Use tenant subdomain as the identifier for related entities
        const tenantId = tenant.subdomain;

        const customerDoc = new Customer({
          tenantId,
          companyName: customer.companyName,
          contactPerson: customer.contactPerson,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          billingInfo: customer.billingInfo
        });

        const warehouseDoc = new Warehouse({
          tenantId,
          name: warehouse.name,
          code: warehouse.code,
          address: warehouse.address,
          manager: warehouse.manager,
          capacity: warehouse.capacity,
          isActive: true
        });

        const hashedPassword = await hashPassword(superAdmin.password);
        const userDoc = new User({
          tenantId,
          username: superAdmin.username,
          email: superAdmin.email,
          password: hashedPassword,
          firstName: superAdmin.firstName,
          lastName: superAdmin.lastName,
          role: 'super_admin',
          isActive: true,
          permissions: ['*']
        });

        await customerDoc.save({ session });
        await warehouseDoc.save({ session });
        await userDoc.save({ session });

        await this.createDefaultRoles(tenantId, session);

        const defaultModules = [
          { enabled: true, name: 'Receiving' },
          { enabled: true, name: 'Putaway' },
          { enabled: true, name: 'Bundling' },
          { enabled: true, name: 'Picking' },
          { enabled: true, name: 'Prepping' },
          { enabled: true, name: 'Packing' },
          { enabled: true, name: 'Stock Cycle Count' },
          { enabled: true, name: 'Stock Transfer' },
          { enabled: true, name: 'Sorting - Outbound' }
        ];

        const tenantDoc = new Tenant({
          name: tenant.name,
          subdomain: tenant.subdomain,
          active: true,
          apiGateway: tenant.apiGateway,
          cubeService: tenant.cubeService,
          socketService: tenant.socketService,
          enabledSimulations: tenant.enabledSimulations || false,
          features: tenant.features || {},
          modules: tenant.modules || defaultModules,
          profile: tenant.profile,
          settings: tenant.settings || {},
          integrations: tenant.integrations || [],
          typeOfCustomer: tenant.typeOfCustomer || ['3PL']
        });

        const tenantResult = await tenantDoc.save({ session });

        res.status(201).json({
          success: true,
          data: {
            tenantId: tenantResult._id,
            tenant: tenantDoc,
            customer: customerDoc,
            warehouse: warehouseDoc,
            superAdmin: { ...userDoc.toObject(), password: undefined }
          }
        });
      });
    } catch (error) {
      console.error('Error creating tenant:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create tenant'
      });
    } finally {
      await session.endSession();
    }
  };

  public getAllTenants = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const tenants = await Tenant
        .find({})
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await Tenant.countDocuments();

      res.json({
        success: true,
        data: {
          tenants,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching tenants:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tenants'
      });
    }
  };

  public getTenantById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid tenant ID'
        });
        return;
      }

      const tenant = await Tenant.findById(id);
      
      if (!tenant) {
        res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
        return;
      }

      // Find related entities using tenant subdomain as identifier
      const customer = await Customer.findOne({ tenantId: tenant.subdomain });
      const warehouse = await Warehouse.findOne({ tenantId: tenant.subdomain });
      const superAdmin = await User.findOne({ 
        tenantId: tenant.subdomain, 
        role: 'super_admin' 
      });

      res.json({
        success: true,
        data: {
          tenant,
          customer,
          warehouse,
          superAdmin: superAdmin ? { ...superAdmin.toObject(), password: undefined } : null
        }
      });
    } catch (error) {
      console.error('Error fetching tenant:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tenant'
      });
    }
  };

  public updateTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid tenant ID'
        });
        return;
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };

      const result = await Tenant.findByIdAndUpdate(id, updateData, { new: true });

      if (!result) {
        res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Tenant updated successfully'
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update tenant'
      });
    }
  };

  public deleteTenant = async (req: Request, res: Response): Promise<void> => {
    const mongoose = DatabaseConnection.getInstance().getConnection();
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { id } = req.params;
        
        if (!id || !Types.ObjectId.isValid(id)) {
          res.status(400).json({
            success: false,
            error: 'Invalid tenant ID'
          });
          return;
        }

        const tenant = await Tenant.findById(id);
        
        if (!tenant) {
          res.status(404).json({
            success: false,
            error: 'Tenant not found'
          });
          return;
        }

        // Delete related entities using tenant subdomain as identifier
        await Customer.deleteOne({ tenantId: tenant.subdomain }, { session });
        await Warehouse.deleteOne({ tenantId: tenant.subdomain }, { session });
        await User.deleteMany({ tenantId: tenant.subdomain }, { session });
        await Role.deleteMany({ tenantId: tenant.subdomain }, { session });
        await Tenant.findByIdAndDelete(id, { session });

        res.json({
          success: true,
          message: 'Tenant deleted successfully'
        });
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete tenant'
      });
    } finally {
      await session.endSession();
    }
  };

  private async createDefaultRoles(tenantId: string, session: any): Promise<void> {
    const defaultRoles = [
      new Role({
        tenantId,
        name: 'Admin',
        description: 'Administrator role with full access',
        permissions: ['manage_users', 'manage_inventory', 'view_reports', 'manage_settings'],
        isSystemRole: true
      }),
      new Role({
        tenantId,
        name: 'Associate',
        description: 'Basic user role with limited access',
        permissions: ['view_inventory', 'update_inventory'],
        isSystemRole: true
      })
    ];

    await Role.insertMany(defaultRoles, { session });
  }
}