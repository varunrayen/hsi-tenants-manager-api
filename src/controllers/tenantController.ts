import { Request, Response } from 'express';
import { Types } from 'mongoose';
import DatabaseConnection from '../config/database';
import { ITenant, ICustomer, IWarehouse, IUser, IRole, CreateTenantRequest, Tenant, Customer, Warehouse, User, Role } from '../models/tenant';
import { generateTenantId, hashPassword } from '../utils/helpers';

export class TenantController {
  constructor() {
    DatabaseConnection.getInstance().connect();
  }

  public createTenant = async (req: Request, res: Response): Promise<void> => {
    const mongoose = DatabaseConnection.getInstance().getConnection();
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { tenant, customer, warehouse, superAdmin, settings }: CreateTenantRequest = req.body;
        
        const tenantId = generateTenantId();

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

        const customerResult = await customerDoc.save({ session });
        const warehouseResult = await warehouseDoc.save({ session });
        const userResult = await userDoc.save({ session });

        await this.createDefaultRoles(tenantId, session);

        const tenantDoc = new Tenant({
          tenantId,
          name: tenant.name,
          domain: tenant.domain,
          status: 'active',
          customerId: customerResult._id,
          warehouseId: warehouseResult._id,
          superAdminId: userResult._id,
          settings: {
            timezone: settings?.timezone || 'UTC',
            currency: settings?.currency || 'USD',
            language: settings?.language || 'en',
            features: settings?.features || []
          }
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

      const customer = await Customer.findById(tenant.customerId);
      const warehouse = await Warehouse.findById(tenant.warehouseId);
      const superAdmin = await User.findById(tenant.superAdminId);

      res.json({
        success: true,
        data: {
          tenant,
          customer,
          warehouse,
          superAdmin: superAdmin ? { ...superAdmin, password: undefined } : null
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

        await Customer.findByIdAndDelete(tenant.customerId, { session });
        await Warehouse.findByIdAndDelete(tenant.warehouseId, { session });
        await User.deleteMany({ tenantId: tenant.tenantId }, { session });
        await Role.deleteMany({ tenantId: tenant.tenantId }, { session });
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