import { UserService } from '../services';
import { IUseCase, UseCaseResponse } from './BaseUseCase';
import { IUser } from '../types';

interface SetupDefaultSuperAdminRequest {
  tenantId: string;
}

export class SetupDefaultSuperAdminUseCase implements IUseCase<SetupDefaultSuperAdminRequest, UseCaseResponse<IUser>> {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async execute(request: SetupDefaultSuperAdminRequest): Promise<UseCaseResponse<IUser>> {
    try {
      const { tenantId } = request;

      const defaultSuperAdminData = {
        name: "Super Admin",
        username: "super.admin",
        password: "$2a$10$muDypVeYS0APX0/XG/vELO/xrew5H51kB17YcgEtWT5QW7.MWwCEa",
        role: "ADMIN",
        hopstackModules: null,
        permissions: [
          { route: "/orders", readable: true, writable: true },
          { route: "/outboundExceptions", readable: true, writable: true },
          { route: "/outbound", readable: true, writable: true },
          { route: "/consignments", readable: true, writable: true },
          { route: "/receivedSkus", readable: true, writable: true },
          { route: "/inbound", readable: true, writable: true },
          { route: "/inventoryMeasurement", readable: true, writable: true },
          { route: "/warehouses", readable: true, writable: true },
          { route: "/customers", readable: true, writable: true },
          { route: "/users", readable: true, writable: true },
          { route: "/integrations", readable: true, writable: true },
          { route: "/workflows", readable: true, writable: true },
          { route: "/totes", readable: true, writable: true },
          { route: "/boxTypes", readable: true, writable: true },
          { route: "/locations", readable: true, writable: true },
          { route: "/skuBinMappings", readable: true, writable: true },
          { route: "/bundles", readable: true, writable: true },
          { route: "/rules", readable: true, writable: true },
          { route: "/products", readable: true, writable: true }
        ],
        pagePreferences: [
          { route: "/orders", visible: true },
          { route: "/outboundExceptions", visible: true },
          { route: "/outbound", visible: true },
          { route: "/consignments", visible: true },
          { route: "/receivedSkus", visible: true },
          { route: "/inbound", visible: true },
          { route: "/inventoryMeasurement", visible: true },
          { route: "/customers", visible: true },
          { route: "/users", visible: true },
          { route: "/integrations", visible: true },
          { route: "/stations", visible: true },
          { route: "/totes", visible: true },
          { route: "/locations", visible: true },
          { route: "/skuBinMappings", visible: true },
          { route: "/bundles", visible: true }
        ],
        tenant: tenantId,
        isDefault: true,
        email: "engineering@hopstack.io",
        isEmailVerified: true,
        termsAndConditionsAccepted: true,
        activated: true,
        meta: {
          lastLogin: Date.now(),
          lastLoginPlatform: "web",
          lastLoginIp: "::ffff:20.0.1.187",
          lastLoginOs: null,
          lastLoginOsVersion: null,
          lastLoginModel: null,
          lastLoginAppVersionName: null,
          lastLoginAppVersionCode: null
        }
      };

      const superAdmin = await this.userService.create(defaultSuperAdminData);

      return {
        success: true,
        data: superAdmin
      };
    } catch (error) {
      console.error('Error setting up default super admin:', error);
      return {
        success: false,
        error: 'Failed to setup default super admin'
      };
    }
  }
}