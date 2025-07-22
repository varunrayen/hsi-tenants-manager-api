import { WarehouseService } from '../services';
import { IUseCase, UseCaseResponse } from './base';
import { IWarehouse } from '../types';

interface SetupDefaultWarehouseRequest {
  tenantId: string;
}

export class SetupDefaultWarehouseUseCase implements IUseCase<SetupDefaultWarehouseRequest, UseCaseResponse<IWarehouse>> {
  private warehouseService: WarehouseService;

  constructor() {
    this.warehouseService = new WarehouseService();
  }

  async execute(request: SetupDefaultWarehouseRequest): Promise<UseCaseResponse<IWarehouse>> {
    try {
      const { tenantId } = request;

      const defaultWarehouseData = {
        name: "Default Warehouse",
        code: "DEF",
        isDefault: true,
        active: true,
        tenant: tenantId,
        location: "Default",
        splitOrdersEnabled: null,
        typeOfWarehouse: ["D2C", "B2B"],
        address: {
          email: "warehouse@company.com",
          phone: "1234567890",
          zip: "00000",
          city: "Default City",
          country: "US",
          line1: "Default Address"
        },
        storageTypes: ["Ambient"]
      };

      const warehouse = await this.warehouseService.create(defaultWarehouseData);

      return {
        success: true,
        data: warehouse
      };
    } catch (error) {
      console.error('Error setting up default warehouse:', error);
      return {
        success: false,
        error: 'Failed to setup default warehouse'
      };
    }
  }
}